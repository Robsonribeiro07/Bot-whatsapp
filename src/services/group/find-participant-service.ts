import { IfAny } from 'mongoose'
import { UserModel } from '../../database/mongoDB/user-schema'
import { IParticipant } from '../../database/mongoDB/models/whatsapp/group/participant'

interface IFindParticipant {
  userID: string
  remoteJid: string
  participantID: string
}

const findParticipantGroupService = async ({
  userID,
  remoteJid,
  participantID,
}: IFindParticipant): Promise<IParticipant | null> => {
  const user = await UserModel.findById(userID)

  if (!user) return null

  const group = user.Groups?.find(g => g.remoteJid === remoteJid)

  if (!group) return null

  const participant = group.participants.find(p => p.id === participantID)

  return participant ?? null
}

export { findParticipantGroupService }
