import { IUserSchema, UserModel } from '../../database/mongoDB/user-schema'

export type IuserDocument = IUserSchema & Document
const userServiceFind = async ({
  jid,
}: {
  jid: string
}): Promise<IuserDocument | null> => {
  if (!jid) return null

  try {
    const findUser: IuserDocument | null = await UserModel.findOne({ _id: jid })

    return findUser
  } catch (err) {
    return null
  }
}

export { userServiceFind }
