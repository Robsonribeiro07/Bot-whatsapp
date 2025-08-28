import { WASocket } from '@whiskeysockets/baileys'
import { GetGroupMetada } from '../../utils/group/get-group-metada'

interface IisWhatasappAdmin {
  sock: WASocket
  remoteJid: string
  participantID: string
}
async function IsWhatasappAdmin({
  sock,
  remoteJid,
  participantID,
}: IisWhatasappAdmin): Promise<Boolean | null> {
  const metada = await GetGroupMetada({ remoteJid, sock })

  const participant = metada?.participants.find(p => p.id === participantID)

  if (!participant) return null

  return participant.admin === 'admin' ? true : null
}

export { IsWhatasappAdmin }
