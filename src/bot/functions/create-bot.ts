import path from 'path'
import fs from 'fs'
import qrcode from 'qrcode-terminal'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import { sessions } from '../../database/bot/sessions'
import pino from 'pino'

const createBot = async (userId: string) => {
  const userIdStr = userId.toString()
  const authPath = path.join(__dirname, 'sessions', userIdStr)

  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true })
  }

  const { state, saveCreds } = await useMultiFileAuthState(authPath)

  if (sessions[userIdStr]) {
    console.log(`Bot do usuário ${userIdStr} já está conectado`)
    return sessions[userIdStr]
  }

  const sock = makeWASocket({ auth: state, logger: pino({ level: 'error' }) })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', update => {
    const { connection, qr } = update

    if (qr && connection !== 'open') {
      console.log(`QR code para usuário ${userIdStr}:`)
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      sessions[userIdStr] = sock
      console.log(`Bot do usuário ${userIdStr} conectado e salvo em sessions`)
    }

    if (connection === 'close') {
      console.log(`Bot do usuário ${userIdStr} desconectou`)
      createBot(userIdStr)
    }
  })

  return sock
}

export { createBot }
