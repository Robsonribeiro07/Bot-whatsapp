import { bots } from '../../database/bot/bot-manager'
import { userServiceFind } from '../users/find-user'
import {
  IUpdateWithWhatsappData,
  updateWithWhatsappDataService,
} from '../users/update-with-whatsapp-data-service'

interface IRemoveParticipants {
  groupId: string
  participantsToRemove: string[]
  userId: string
}

export interface IResponseRemoveParticipants {
  code: 200 | 404 | 500
  userUpdated?: IUpdateWithWhatsappData
  message: string
}
export async function RemoveParticipantsTogGroupSerivces({
  groupId,
  participantsToRemove,
  userId,
}: IRemoveParticipants): Promise<IResponseRemoveParticipants> {
  if (!userId || !groupId || !participantsToRemove.length)
    return {
      code: 404,
      message: 'todos dados sao obrigatorios',
    }

  try {
    const findUser = await userServiceFind({ id: userId })
    if (!findUser) return { code: 404, message: 'Usuario nao encontrado' }

    const findSock = bots[findUser.id]

    if (!findSock) return { code: 404, message: 'Sock nao encontrado' }

    findSock.sock?.groupParticipantsUpdate(
      groupId,
      participantsToRemove,
      'remove',
    )

    const updateGroup = await findSock.GetUserData()
    await updateWithWhatsappDataService({
      userId,
      groups: updateGroup?.groups,
    })

    await findUser.save()

    return {
      message: 'Usuario Removido com sucesso',
      userUpdated: findUser,
      code: 200,
    }
  } catch (err) {
    return {
      message: (err as Error).message,
      code: 500,
    }
  }
}
