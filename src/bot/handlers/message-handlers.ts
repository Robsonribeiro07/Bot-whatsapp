import { WASocket } from '@whiskeysockets/baileys'
import { SendMessageWithDelay } from './send-message-with-delay'
import { CreateNewRifa } from './Rifa/create-new-raffle'
import { updateRifas } from '../commands/Raffle/update.rafles'
import { MonitorReplySentRifa } from './Group/monitor-reply-sent-message'
import { userServiceCreate } from '../../services/users/create-user'

interface MonitorGroupOptions {
  sock: WASocket
  groupId: string
}
const MonitorGroup = ({ sock, groupId }: MonitorGroupOptions) => {
  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]

    console.log('id do chat', msg.key.remoteJid)
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
      } else if (text.toLowerCase().includes('rifa')) {
        const result = await userServiceCreate({
          id: '12',
          name: 'Robson',
          number: '3232',
        })

        console.log(result)
      } else if (text.toLowerCase().includes('!update')) {
        updateRifas(sock)
      }
    }
  })
}
export { MonitorGroup }
