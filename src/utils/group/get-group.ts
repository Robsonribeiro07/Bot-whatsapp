import { IGroup } from '../../database/mongoDB/models/user-schema'
import { IuserDocument, userServiceFind } from '../../services/users/find-user'

interface IGetgroups {
  userId: string
  groupId: string
}

interface IGetGroupsDataResponse {
  message: string
  groupData?: IGroup
  user?: IuserDocument
}
export async function GetGroupData({
  userId,
  groupId,
}: IGetgroups): Promise<IGetGroupsDataResponse> {
  try {
    const findUser = await userServiceFind({ id: userId })

    if (!findUser)
      return {
        message: 'Usuario nao encontrado',
      }

    const findGroup = findUser.WhatsappData?.groups?.find(g => g.id === groupId)

    if (!findGroup)
      return {
        message: 'Group not found',
      }
    return {
      message: 'Dados retornado dos com sucesso',
      groupData: findGroup,
      user: findUser,
    }
  } catch (err) {
    return {
      message: (err as Error).message,
    }
  }
}
