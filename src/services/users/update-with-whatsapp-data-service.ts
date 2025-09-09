import { IUserSchema } from '../../database/mongoDB/user-schema'
import { userServiceFind } from './find-user'

export interface IUpdateWithWhatsappData {
  userId?: string
  id?: string
  name?: string
  imgUrl?: string | null
  lid?: string
  jid?: string
  verifiedName?: string
  notify?: string
  connectedAt?: Date
  status?: string
  user?: string
}

export interface IUpdateWithWhatsappDataResponse {
  statusCode: 201 | 404 | 500
  message: string
}

export async function updateWithWhatsappDataService({
  userId,
  connectedAt,
  id,
  notify,
  verifiedName,
  name,
  status,
  lid,
  jid,
  imgUrl,
}: IUpdateWithWhatsappData): Promise<IUpdateWithWhatsappDataResponse> {
  const findUser = await userServiceFind({ id: userId })

  if (!findUser) {
    return {
      statusCode: 404,
      message: 'Usuário não encontrado',
    }
  }

  try {
    if (!findUser.WhatsappData) findUser.WhatsappData = {}

    if (id !== null) findUser.WhatsappData.id = id
    if (connectedAt) findUser.WhatsappData.connectedAt = connectedAt
    if (notify) findUser.WhatsappData.notify = notify
    if (verifiedName) findUser.WhatsappData.verifiedName = verifiedName
    if (name) findUser.WhatsappData.name = name
    if (jid) findUser.WhatsappData.jid = jid
    if (imgUrl) findUser.WhatsappData.imgUrl = imgUrl
    if (lid) findUser.WhatsappData.lid = lid
    if (status) findUser.WhatsappData.status = status
    if (id !== undefined) findUser.id = id

    await findUser.save()

    return {
      statusCode: 201,
      message: 'Dados atualizados com sucesso',
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: (err as Error).message ?? 'Houve um erro interno',
    }
  }
}
