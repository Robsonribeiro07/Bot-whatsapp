import { useBotStore } from '../../../store/sock-store'
import { proto, WAMessage, WASocket } from '@whiskeysockets/baileys'
import { reserveNumbers } from '../Rifa/tickets/reserve-number'
import GetMessageText from '../../../utils/group/get-message-text'
import { sendMessageIaService } from '../../../services/IA/send-message-service'
import { RaffleManage } from '../../manager/raffle/raffle-manager'

export const MonitorReplySentRifa = async (m: WAMessage, sock: WASocket) => {
  console.log('ta chegnado aqui 5 ')

  if (!m) return

  console.log('ta chegnado aqui ')
  const msg = m.message

  if (!msg) return

  const repliedMsgId = msg.extendedTextMessage?.contextInfo?.stanzaId

  if (!msg.conversation) return

  const raffleManager = new RaffleManage()

  const { response } = await raffleManager.processeMessageFn(
    msg.conversation,
    m.key.participant!,
  )

  await sock.sendMessage(m.key.remoteJid!, {
    text: response?.reply!,
  })
}
