import path from 'path'
import fs, { mkdir } from 'fs'
import qrcode from 'qrcode-terminal'
import makeWASocket, {
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys'
import { sessions } from '../../database/bot/sessions'
import pino from 'pino'

class BotManager {
  private userID: string
  private authPath: string
  private sock?: WASocket

  constructor(userID: string) {
    this.userID = userID
    this.authPath = path.join(__dirname, 'sessions', this.userID)

    if (!fs.existsSync(this.authPath))
      fs.mkdirSync(this.authPath, { recursive: true })
  }

  public async connect(): Promise<WASocket> {
    if (sessions[this.userID]) {
      console.log('Bot do usuario', this.userID, 'ja esta conectado')
      return sessions[this.userID]
    }

    const { state, saveCreds } = await useMultiFileAuthState(this.authPath)

    this.sock = makeWASocket({ auth: state, logger: pino({ level: 'error' }) })

    this.sock.ev.on('creds.update', saveCreds)

    this.sock.ev.on('connection.update', update =>
      this.handleConnection(update),
    )

    return this.sock
  }

  private async handleConnection(update: any) {
    const { connection, qr } = update

    if (qr && connection !== 'open') {
      console.log('Qr code gerado', this.userID)
      qrcode.generate(qr, {
        small: true,
      })
    }

    if (connection === 'open' && this.sock) {
      sessions[this.userID] = this.sock
      console.log(
        `Bot do usuario ${this.userID} conectado com sucesso e salvo em session`,
      )
    }

    if (connection === 'close') {
      console.log(`Bot do usario ${this.userID} desconectou`)
      await this.connect()
    }
  }
}

export { BotManager }
