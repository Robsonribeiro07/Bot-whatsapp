import { proto, WASocket } from '@whiskeysockets/baileys'
import { RafflesStorage } from '../../../database/raffle-storage'
import { timeToMinutes } from '../../../utils/time-to-minutes'
import { getMessageHour } from '../../../utils/get-message-data'
import { SendMessageWithDelay } from '../../handlers/send-message-with-delay'
import { formatRifaMessageDisponivel } from '../../../utils/formated-ticket-avaliable'
import { useBotStore } from '../../../store/sock-store'

const TicketsAvaliables = async (
  sock: WASocket,

  msg?: proto.IWebMessageInfo,
) => {
  const { groupId } = useBotStore.getState()

  if (!msg) return

  const RaffleId = msg.message?.extendedTextMessage?.contextInfo?.remoteJid

  const UserHours = getMessageHour(msg)

  if (RaffleId) {
    const FinndRafle = RafflesStorage.find(r =>
      r.messageId.some(id => id === RaffleId),
    )

    if (FinndRafle) {
      await SendMessageWithDelay({
        jid: groupId,
        sock,
        text: formatRifaMessageDisponivel(FinndRafle),
      })
    }
  }

  const FinndRafle = RafflesStorage.reduce((prev, curr) => {
    const prevDiff = Math.abs(
      timeToMinutes(prev.horario) - timeToMinutes(UserHours),
    )
    const currDiff = Math.abs(
      timeToMinutes(curr.horario) - timeToMinutes(UserHours),
    )
    return currDiff < prevDiff ? curr : prev
  })

  await SendMessageWithDelay({
    jid: groupId,
    sock,
    text: formatRifaMessageDisponivel(FinndRafle),
  })
}
export { TicketsAvaliables }
