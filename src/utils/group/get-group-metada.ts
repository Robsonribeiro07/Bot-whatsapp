import { GroupMetadata, proto, WASocket } from '@whiskeysockets/baileys'
import { useBotStore } from '../../store/sock-store'

interface IGetGroupMetada {
  remoteJid?: string
  msg?: proto.IWebMessageInfo
  sock: WASocket
}

export const GetGroupMetada = async ({
  remoteJid,
  msg,
  sock,
}: IGetGroupMetada) => {
  if (!sock) return

  return msg?.key.remoteJid
    ? await sock.groupMetadata(msg.key.remoteJid)
    : await sock.groupMetadata(remoteJid ?? '')
}
