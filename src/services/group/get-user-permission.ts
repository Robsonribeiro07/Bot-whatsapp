import { GroupParticipant } from '@whiskeysockets/baileys'
import { Permission } from '../../bot/rules/types'
import { findParticipantGroupService } from './find-participant-service'

interface IgetUserPermission {
  remoteJid: string
  userID: string
  participantID: string
}
const getUserPermissionsService = async ({
  remoteJid,
  userID,
  participantID,
}: IgetUserPermission) => {
  const participant = await findParticipantGroupService({
    remoteJid,
    participantID,
    userID,
  })

  if (!participant) return

  const perms: Permission[] = [...(participant.rules || [])]

  if (participant.admin === 'admin') {
    if (!perms.includes('ALL_PERMISSIONS')) {
      perms.push('ALL_PERMISSIONS')
    }
  }

  return perms
}

export { getUserPermissionsService }
