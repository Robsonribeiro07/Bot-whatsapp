import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'

async function StartBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth-info')

  const socket = makeWASocket({
    auth: state,
  })

  socket.ev.on('creds.update', saveCreds)

  socket.ev.on('connection.update', (uptade) => {
    const { connection, qr } = uptade

    if (qr) {
      qrcode.generate(qr, { small: true })
      console.log('qr code gerado com sucesso')
    }

    if (connection === 'close') {
      console.log('Desconectado, tentando reconectar...')
      StartBot()
    } else if (connection === 'open') {
      console.log('Bot Conectado')
    }
  })

  return socket
}

export { StartBot }
