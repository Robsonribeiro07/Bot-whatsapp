import { IParticipant } from '../../../database/mongoDB/models/whatsapp/group/participant'
import { GetGroupData } from '../get-group'

interface IGetRolesParticipants {
  userId: string
  groupId: string
  participantId: string
}

interface IGetRolesParticipantsResponse {
  isAdmin: boolean
  message: string
}

export async function getRolesParticipant({
  userId,
  groupId,
  participantId,
}: IGetRolesParticipants): Promise<IGetRolesParticipantsResponse> {
  let isAdmin: boolean = false

  if (!participantId)
    return {
      message: 'Todos os campos sao obrigatorios',
      isAdmin,
    }
  try {
    const group = await GetGroupData({ groupId, userId })

    if (!group)
      return {
        message: 'Group not found',
        isAdmin,
      }

    const participant = group.groupData?.participants.find(
      p => p.id === participantId,
    )

    if (!participant)
      return {
        message: 'Usuario  nao encontrado',
        isAdmin,
      }

    isAdmin = participant.isSuperAdmin || participant.isSuperAdmin

    return {
      message: 'Usuario e um admin',
      isAdmin,
    }
  } catch (err) {
    return {
      message: (err as Error).message,
      isAdmin,
    }
  }
}
