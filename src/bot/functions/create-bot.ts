import path from 'path'
import * as fs from 'fs' // IMPROVEMENT: Import padrão para fs em ESM, evita confusão.
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  ConnectionState,
} from '@whiskeysockets/baileys'
import { sessions } from '../../database/bot/sessions'
import pino from 'pino'
import EventEmitter from 'events'
import qrcode from 'qrcode'
import { connectSockets } from '../../socket'
import { Boom } from '@hapi/boom'
import { Socket } from 'socket.io'
import { updateWithWhatsappDataService } from '../../services/users/update-with-whatsapp-data-service'

class BotManager extends EventEmitter {
  private userID: string
  private authPath: string
  private sock?: WASocket
  private qrCode?: { qr: string; base64: string }
  private reconnecting = false
  private socket?: Socket
  private status: boolean = false
  private intentionalLogout = false
  private isUloadingDataRemote = false
  private profileUpdateInterval?: NodeJS.Timeout // IMPROVEMENT: Controle para limpar interval.
  private saveCreds?: () => Promise<void> // Nova propriedade para acessar saveCreds
  private intentionalReconnect = false // Nova flag para reconexão após rename

  constructor(userID: string) {
    super()
    this.userID = userID
    this.authPath = path.join(__dirname, 'sessions', this.userID)
    this.socket = connectSockets[this.userID] // Assumindo que existe; adicione check se necessário.
    this.createAuthPath()
  }

  public async connect(): Promise<WASocket> {
    if (sessions[this.userID]) return sessions[this.userID]

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.authPath)
      this.saveCreds = saveCreds // Armazena para uso posterior

      this.sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'error' }),
      })

      this.sock.ev.on('creds.update', saveCreds)

      this.sock.ev.on('connection.update', async update => {
        await this.handleConnection(update)

        if (update.connection === 'open') {
          await this.updateSessionBot() // Chama update aqui
          await this.UpdateUserDataWithWhatsappData()

          if (this.profileUpdateInterval)
            clearInterval(this.profileUpdateInterval)
          this.profileUpdateInterval = setInterval(
            () => this.GetUserData(),
            60000,
          )
        }
      })

      return this.sock
    } catch (err) {
      console.error(`Erro ao conectar bot para user ${this.userID}:`, err)
      throw err
    }
  }

  public async regenerateQrcode(): Promise<void> {
    if (!this.sock) {
      console.log('Bot não está conectado')
      return
    }
    this.intentionalLogout = true
    try {
      await this.sock.logout()
    } catch (err) {
      console.error('Erro ao logout:', err)
    } finally {
      this.intentionalLogout = false
    }
    await this.clearSession()
    await this.connect()
  }

  public getQRCode(): { qr: string; base64: string } | undefined {
    return this.qrCode
  }

  public getStatus(): boolean {
    return this.status
  }

  private async reconnectDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private createAuthPath() {
    if (!fs.existsSync(this.authPath)) {
      fs.mkdirSync(this.authPath, { recursive: true })
    }
  }

  public async updateSessionBot() {
    if (!this.sock?.user?.id) {
      console.warn(`user.id não disponível para ${this.userID}. Aguardando...`)
      return
    }

    const { user } = this.sock
    const oldId = this.userID
    if (oldId === user.id) return

    const oldPath = this.authPath
    const newPath = path.join(__dirname, 'sessions', user.id)

    try {
      if (this.saveCreds) {
        console.log(
          `Flushando credenciais antes de renomear para ${user.id}...`,
        )
        await this.saveCreds()
        await this.reconnectDelay(1000)
      }

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath)
        console.log(`Pasta renomeada de ${oldId} para ${user.id}`)
      }

      this.userID = user.id
      this.authPath = newPath

      // Atualiza sessions e sockets
      const sock = connectSockets[oldId]
      const botInstance = sessions[oldId]
      delete connectSockets[oldId]
      delete sessions[oldId]
      connectSockets[user.id] = sock
      sessions[user.id] = botInstance

      // Passo 3: Força reconexão com novo path
      if (this.sock) {
        this.intentionalReconnect = true
        console.log(`Forçando reconexão para usar novo authPath: ${newPath}`)
        this.sock.end(new Error('Reniciando bot'))
      }
    } catch (err) {
      console.error(`Erro ao atualizar sessão para ${user.id}:`, err)
    }
  }

  private async handleConnection(update: Partial<ConnectionState>) {
    const { connection, qr, lastDisconnect } = update

    if (qr && connection !== 'open') {
      try {
        const base64 = await qrcode.toDataURL(qr)
        this.qrCode = { qr, base64 }
        this.status = false
        this.emit('qrcode', this.qrCode)
        this.socket?.emit('qrcode', this.qrCode)
      } catch (err) {
        console.error('Erro ao gerar QR base64:', err)
      }
    }

    if (connection === 'open' && this.sock) {
      this.status = true
      this.socket?.emit('bot-connected')
      console.log(`Bot do usuário ${this.userID} conectado com sucesso.`)
      this.qrCode = undefined
    }

    if (connection === 'close') {
      this.status = false
      if (this.intentionalLogout) return

      let statusCode: number | undefined

      if (lastDisconnect?.error && 'output' in lastDisconnect.error) {
        const boomError = lastDisconnect.error as Boom
        statusCode = boomError.output?.statusCode
      }

      if (this.reconnecting) return
      this.reconnecting = true

      try {
        let shouldClearSession = false

        if (
          statusCode === DisconnectReason.loggedOut ||
          statusCode === DisconnectReason.badSession ||
          statusCode === DisconnectReason.connectionReplaced
        ) {
          console.log('Sessão inválida ou substituída. Limpando sessão...')
          shouldClearSession = true
        } else {
          console.log(
            `Desconexão detectada (código: ${statusCode ?? 'desconhecido'}). Tentando reconectar sem limpar...`,
          )
        }

        if (shouldClearSession) {
          await this.clearSession()
        }

        this.sock = undefined
        delete sessions[this.userID]

        await this.reconnectDelay(2000)
        await this.connect()

        if (this.sock) {
          this.socket?.emit('bot-connected')
          this.status = true
        }

        console.log('Usuário reconectado')
      } catch (err) {
        console.error('Erro ao tentar reconectar:', err)
      } finally {
        this.reconnecting = false
        this.intentionalReconnect = false
      }
    }
  }

  private async UpdateUserDataWithWhatsappData() {
    if (!this.sock?.user) return // FIX: Check precoce.

    this.isUloadingDataRemote = true
    try {
      const updateData = await this.GetUserData()
      if (!updateData) return

      const { id, lid, imgUrl, verifiedName, notify, status, jid, name } =
        updateData

      await updateWithWhatsappDataService({
        lid,
        userId: id,
        jid,
        name,
        id,
        notify,
        status,
        verifiedName,
        imgUrl,
      })

      this.userID = id
      this.socket?.emit('new-id', id)
    } catch (err) {
      console.error('Erro ao atualizar dados com WhatsApp:', err)
    } finally {
      this.isUloadingDataRemote = false
    }
  }

  public async GetUserData() {
    if (!this.sock?.user || !this.status) return

    try {
      const { id, jid, lid, name, notify, status, verifiedName } =
        this.sock.user
      if (!id) return

      let profilePictureUrl: string | undefined
      try {
        profilePictureUrl = await this.sock.profilePictureUrl(id, 'image')
      } catch (err) {
        console.warn('Erro ao obter foto de perfil:', err)
        profilePictureUrl = undefined
      }

      const updateData = {
        id,
        imgUrl: profilePictureUrl,
        jid,
        lid,
        name,
        notify,
        status,
        verifiedName,
      }

      if (!this.isUloadingDataRemote && this.socket) {
        this.socket.emit('new-user-data', updateData)
      }

      return updateData
    } catch (err) {
      console.error('Erro ao obter dados do usuário:', err)
    }
  }

  public async clearSession() {
    if (fs.existsSync(this.authPath)) {
      fs.rmSync(this.authPath, { recursive: true, force: true })
    }
    this.status = false
    this.sock = undefined
    if (this.profileUpdateInterval) clearInterval(this.profileUpdateInterval)
  }
}

export { BotManager }
