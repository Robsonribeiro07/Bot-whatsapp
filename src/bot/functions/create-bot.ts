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
import { mapGroupsMetadataToIGroup } from '../../utils/group/map-groups-metadada-to-igroup'
import { IGroup } from '../../database/mongoDB/models/user-schema'

class BotManager extends EventEmitter {
  private userID: string
  private authPath: string
  public sock?: WASocket
  private qrCode?: { qr: string; base64: string }
  private reconnecting = false
  public socket?: Socket
  private status: boolean = false
  private intentionalLogout = false
  private isUloadingDataRemote = false
  private profileUpdateInterval?: NodeJS.Timeout
  private saveCreds?: () => Promise<void>
  private intentionalReconnect = false
  private ConnectAt: Date

  constructor(userID: string) {
    super()
    this.userID = userID
    this.authPath = path.join(__dirname, 'sessions', this.userID)
    this.socket = connectSockets[this.userID]
    this.ConnectAt = new Date()
    this.createAuthPath()
  }

  public async connect(): Promise<WASocket> {
    if (sessions[this.userID]) return sessions[this.userID]

    const authFilesExist = this.checkAuthFilesExist()

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.authPath)
      this.saveCreds = saveCreds

      this.sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'error' }),
      })

      this.sock.ev.on('creds.update', saveCreds)

      this.sock.ev.on('connection.update', async update => {
        await this.handleConnection(update)

        if (update.connection === 'open') {
          await this.UpdateUserDataWithWhatsappData()

          if (this.profileUpdateInterval)
            clearInterval(this.profileUpdateInterval)
          this.profileUpdateInterval = setInterval(
            () => this.GetUserData(),
            15000,
          )
        }
      })

      this.sock.ev.on('contacts.update', updates => {
        console.log('updates', updates)
      })

      if (authFilesExist) {
        this.status = true
        this.socket?.emit('bot-connected')
        console.log(
          `Bot do usuário ${this.userID} carregado de sessão existente e marcado como conectado.`,
        )
      }

      return this.sock
    } catch (err) {
      throw err
    }
  }

  // Nova função para verificar se os arquivos de autenticação existem
  private checkAuthFilesExist(): boolean {
    const credsPath = path.join(this.authPath, 'creds.json')
    return fs.existsSync(credsPath) // Verifica se creds.json existe, por exemplo
  }

  public async regenerateQrcode(): Promise<void> {
    this.intentionalLogout = true
    try {
      await this.sock?.logout()
    } catch (err) {
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

  private async handleConnection(update: Partial<ConnectionState>) {
    const { connection, qr, lastDisconnect } = update

    if (qr && connection !== 'open') {
      try {
        const base64 = await qrcode.toDataURL(qr)
        this.qrCode = { qr, base64 }
        this.status = false
        this.emit('qrcode', this.qrCode)
        this.socket?.emit('qrcode', this.qrCode)
      } catch (err) {}
    }

    if (connection === 'open' && this.sock) {
      this.status = true
      this.ConnectAt = new Date()
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
    if (!this.sock?.user) return

    this.isUloadingDataRemote = true

    this.socket?.emit('uploading-data')
    await new Promise<void>((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.sock && this.status) {
          clearInterval(checkInterval)
          resolve()
        }
      })
    })
    try {
      const updateData = await this.GetUserData()
      if (!updateData) return

      const {
        id,
        lid,
        imgUrl,
        verifiedName,
        notify,
        status,
        jid,
        name,
        groups,
      } = updateData

      this.socket?.emit('send-name-update', `quase la ${name} `)
      await updateWithWhatsappDataService({
        lid,
        userId: this.userID,
        jid,
        name,
        connectedAt: this.ConnectAt,
        id,
        notify,
        status,
        verifiedName,
        imgUrl,
        groups,
      })

      setTimeout(() => {
        this.socket?.emit('finished', this.userID)
      }, 2000)
    } catch (err) {
      console.error('Erro ao atualizar dados com WhatsApp:', err)
    } finally {
      this.isUloadingDataRemote = false
    }
  }

  public async GetUserData() {
    if (!this.sock?.user || !this.status) return

    try {
      const { id, jid, lid, name, notify, verifiedName, status } =
        this.sock.user
      if (!id) return

      let profilePictureUrl: string | undefined
      let isGroup: IGroup[] = []
      try {
        profilePictureUrl = await this.sock.profilePictureUrl(id, 'image')
        const AllgroupsObj = await this.sock.groupFetchAllParticipating()
        const groupsMetadata = Object.values(AllgroupsObj)

        isGroup = await mapGroupsMetadataToIGroup(this.sock, groupsMetadata)
      } catch (err) {
        console.warn('Erro ao obter foto de perfil:', err)
        profilePictureUrl = undefined
      }

      const updateData = {
        id: this.userID,
        imgUrl: profilePictureUrl,
        jid,
        lid,
        name,
        notify,
        status,
        verifiedName,
        connectedAt: new Date(),
        groups: isGroup,
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
      this.status = false
      this.sock = undefined
    }

    if (this.profileUpdateInterval) clearInterval(this.profileUpdateInterval)
  }
  public handleSetSocket(socket: Socket) {
    this.socket = socket
  }
}

export { BotManager }
