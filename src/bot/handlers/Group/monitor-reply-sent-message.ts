import { useBotStore } from '../../../store/sock-store'
import { proto, WASocket } from '@whiskeysockets/baileys'
import { reserveNumbers } from '../Rifa/tickets/reserve-number'
import GetMessageText from '../../../utils/group/get-message-text'

export const MonitorReplySentRifa = async (
  m: proto.IWebMessageInfo,
  sock: WASocket,
) => {
  const { groupId } = useBotStore.getState()

  if (!sock || !m) return

  const msg = m.message

  if (!msg) return

  const assinante = m.pushName || m.key.remoteJid || ''

  const Numbers = GetMessageText(m)

  const NumberConverted = Numbers?.split(/[\s,]+/)
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n))

  if (!assinante && !Numbers) return

  if (m.key.remoteJid !== groupId) return

  const repliedMsgId = msg.extendedTextMessage?.contextInfo?.stanzaId

  if (
    repliedMsgId &&
    ((repliedMsgId && !Array.isArray(NumberConverted)) ||
      !NumberConverted?.every(n => typeof n === 'number'))
  )
    return

  await reserveNumbers({
    assinante,
    numbers: NumberConverted,
    groupId,
    RifaId: repliedMsgId,
    msg: m,
    sock,
  })
}
