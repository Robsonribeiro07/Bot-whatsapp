import { WASocket } from '@whiskeysockets/baileys'
import { SendMessageWithDelay } from './send-message-with-delay'
import { MonitorReplySentRifa } from './Group/monitor-reply-sent-message'

interface MonitorGroupOptions {
  sock: WASocket
  groupId: string
}
const MonitorGroup = ({ sock, groupId }: MonitorGroupOptions) => {
  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]

    if (!msg.message) return

    if (msg.key.remoteJid === groupId) {
      const text = msg.message.conversation || ''

      if (msg.message.extendedTextMessage?.contextInfo?.stanzaId) {
        MonitorReplySentRifa(msg, sock)
      }

      if (text.toLocaleLowerCase().includes('ola')) {
        await SendMessageWithDelay({
          jid: groupId,
          text: 'Seja bem vindo',
          sock,
          delayMS: 200,
        })
      }
    }
  })
}
export { MonitorGroup }
