import { IUpdateWithWhatsappDataDTO } from '../../routes/dtos/update-with-whatsapp-data'
import { userServiceFind } from './find-user'

interface IUpdateWithWhatsappData extends IUpdateWithWhatsappDataDTO {
  user: string
}

export interface IUpdateWithWhatsappDataResponse {
  statusCode: 201 | 404 | 500
  message: string
}

export async function updateWithWhatsappDataService({
  user,
  connectedAt,
  id,
  notify,
  verifiedName,
  name,
}: IUpdateWithWhatsappData): Promise<IUpdateWithWhatsappDataResponse> {
  const findUser = await userServiceFind({ user })

  if (!findUser)
    return {
      statusCode: 404,
      message: 'usuario nao encontrado',
    }

  try {
    if (!findUser.WhatsappData) {
      findUser.WhatsappData = {}
    }

    findUser.WhatsappData.connectedAt =
      connectedAt ?? findUser.WhatsappData?.connectedAt
    findUser.WhatsappData.id = id ?? findUser.WhatsappData.id
    findUser.WhatsappData.notify = notify ?? findUser.WhatsappData.notify
    findUser.WhatsappData.verifiedName =
      verifiedName ?? findUser.WhatsappData.verifiedName
    findUser.WhatsappData.name = name ?? findUser.WhatsappData.name

    await findUser.save()

    return {
      statusCode: 201,
      message: 'dados atualizado com sucesso',
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: 'Houve um erro inteno',
    }
  }
}
