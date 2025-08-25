import { useBotStore } from '../../../store/sock-store'
import { proto } from '@whiskeysockets/baileys'
import { reserveNumbers } from '../Rifa/tickets/reserve-number'

export const MonitorReplySentRifa = async (m: proto.IWebMessageInfo) => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock || !m) return

  const msg = m.message

  if (!msg) return

  const assinante = m.pushName || m.key.remoteJid || ''

  const Numbers =
    m.message?.conversation || m.message?.extendedTextMessage?.text

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
  })
}
