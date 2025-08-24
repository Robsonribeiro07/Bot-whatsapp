import { useBotStore } from '../../../store/sock-store'
import { proto } from '@whiskeysockets/baileys'
import { ReservedNumber } from '../Rifa/ReserverdNumber'

export const MonitorReplySentRifa = (m: proto.IWebMessageInfo) => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock || !m) return

  const msg = m.message

  if (!msg) return

  const assinante = m.pushName || m.key.remoteJid || ''

  const Numbers = m.message?.conversation || m.message?.extendedTextMessage?.text

  const NumberConverted = Numbers?.split(/[\s,]+/)
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n))

  if (!assinante && !Numbers) return

  if (m.key.remoteJid !== groupId) return

  const repliedMsgId = msg.extendedTextMessage?.contextInfo?.stanzaId

  if (!repliedMsgId) return

  ReservedNumber({ assinante, number: NumberConverted, groupId, RifaId: repliedMsgId, msg: m })
}
