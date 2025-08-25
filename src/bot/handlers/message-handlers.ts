import { WASocket } from '@whiskeysockets/baileys'
import { SendMessageWithDelay } from './send-message-with-delay'
import { CreateNewRifa } from './Rifa/create-new-raffle'
import { updateRifas } from '../commands/Raffle/update.rafles'
import { MonitorReplySentRifa } from './Group/monitor-reply-sent-message'

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
        MonitorReplySentRifa(msg)
      }

      if (text.toLocaleLowerCase().includes('ola')) {
        await SendMessageWithDelay({
          jid: groupId,
          text: 'Seja bem vindo',
          delayMS: 200,
        })
      } else if (text.toLowerCase().includes('rifa')) {
        const newRifa = await CreateNewRifa({
          hour: '19:00',
          value: '800',
          id: '210',
          sock,
        })

        if (newRifa.Error?.message && !newRifa.sucessed?.message)
          return SendMessageWithDelay({
            delayMS: 100,
            jid: groupId,
            text: 'Houve um erro ao criar rifa',
          })
      } else if (text.toLowerCase().includes('!update')) {
        updateRifas()
      }
    }
  })
}
export { MonitorGroup }
