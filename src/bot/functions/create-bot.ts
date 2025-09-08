import path from 'path'
import fs, { existsSync, renameSync } from 'fs'
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

class BotManager extends EventEmitter {
  private userID: string
  private authPath: string
  private sock?: WASocket
  private qrCode?: { qr: string; base64: string }
  private reconnecting = false
  private socket?: Socket
  private status: boolean
  private intentionalLogout = false

  constructor(userID: string) {
    super()
    this.userID = userID
    this.authPath = path.join(__dirname, 'sessions', this.userID)
    this.socket = connectSockets[this.userID]
    this.status = false
    this.createAuthPath()
  }

  public async connect(): Promise<WASocket> {
    if (sessions[this.userID]) return sessions[this.userID]

    const { state, saveCreds } = await useMultiFileAuthState(this.authPath)

    this.sock = makeWASocket({ auth: state, logger: pino({ level: 'error' }) })

    this.sock.ev.on('creds.update', async () => {
      await saveCreds()

      setTimeout(() => {
        this.updateSessionBot()
      }, 10000)
    })
    this.sock.ev.on('connection.update', update =>
      this.handleConnection(update),
    )

    return this.sock
  }

  // Regenera QR code sem reconectar automaticamente
  public async regenerateQrcode(): Promise<void> {
    if (!this.sock) return console.log('Bot não está conectado')
    this.intentionalLogout = true
    await this.sock.logout()
    this.intentionalLogout = false
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
    if (!existsSync(this.authPath))
      fs.mkdirSync(this.authPath, { recursive: true })
  }

  public async updateSessionBot() {
    await new Promise<void>(resolve => {
      const checkSocket = () => {
        if (this.sock?.user?.id) {
          const { user } = this.sock
          const oldId = this.userID
          const sock = connectSockets[oldId]
          const botInstance = sessions[oldId]

          delete connectSockets[oldId]
          delete sessions[oldId]

          this.userID = user.id
          connectSockets[user.id] = sock
          sessions[user.id] = botInstance
          const newPath = path.join(__dirname, 'sessions', user.id)
          if (existsSync(this.authPath)) renameSync(this.authPath, newPath)
          this.authPath = newPath

          resolve()
        } else {
          setTimeout(checkSocket, 100)
        }
      }
      checkSocket()
    })
  }

  private async handleConnection(update: Partial<ConnectionState>) {
    const { connection, qr, lastDisconnect } = update

    // QR code gerado
    if (qr && connection !== 'open') {
      const base64 = await qrcode.toDataURL(qr)
      this.qrCode = { qr, base64 }
      this.status = false
      this.emit('qrcode', this.qrCode)
      this.socket?.emit('qrcode', this.qrCode)
    }

    // Bot conectado
    if (connection === 'open' && this.sock) {
      this.status = true
      this.socket?.emit('bot-connected')
      console.log(`Bot do usuário ${this.userID} conectado com sucesso.`)
      this.qrCode = undefined
    }

    // Reconexão
    if (connection === 'close') {
      if (this.status || this.intentionalLogout) return
      this.status = false
      const statusCode = (lastDisconnect?.error as Boom)?.output.statusCode
      if (this.reconnecting) return

      this.reconnecting = true
      try {
        if (statusCode === DisconnectReason.connectionReplaced) {
          console.log('Sessão encerrada. Limpando sessão...')
        }
        await this.reconnectDelay(2000)
        await this.connect()

        if (this.sock) {
          this.socket?.emit('bot-connected')
        }
        console.log('Usuário reconectado')
      } catch (err) {
        console.error('Erro ao tentar reconectar:', err)
      } finally {
        this.reconnecting = false
      }
    }
  }
}

export { BotManager }
