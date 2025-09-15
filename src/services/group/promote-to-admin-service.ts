import { ParticipantAction } from '@whiskeysockets/baileys'
import { bots } from '../../database/bot/bot-manager'
import { getRolesParticipant } from '../../utils/group/user/get-roles'

export interface IPromoteGroup {
  userId: string
  groupId: string
  participantId: string
  promote: ParticipantAction
}

export interface IPromoteGroupResponse {
  code: 200 | 403 | 404 | 500
  message: string
}
export async function PromoteGroupSerivces({
  userId,
  groupId,
  participantId,
  promote,
}: IPromoteGroup): Promise<IPromoteGroupResponse> {
  try {
    const finderSock = bots[userId]

    if (!finderSock.sock)
      return {
        message: 'sock nao encontrado',
        code: 403,
      }
    const getPermission = await getRolesParticipant({
      userId,
      groupId,
      participantId,
    })

    if (!getPermission)
      return {
        message: 'Usuario nao tem permissao',
        code: 403,
      }

    await finderSock.sock?.groupParticipantsUpdate(
      groupId,
      [participantId],
      promote,
    )

    await finderSock.GetUserData()

    return {
      message: `Promote Realizado com sucesso ${promote}`,
      code: 200,
    }
  } catch (err) {
    return {
      message: (err as Error).message,
      code: 500,
    }
  }
}
