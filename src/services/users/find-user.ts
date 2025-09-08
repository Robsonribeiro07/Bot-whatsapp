import { IUserSchema, UserModel } from '../../database/mongoDB/user-schema'

export type IuserDocument = IUserSchema & Document
const userServiceFind = async ({
  id,
}: {
  id?: string
}): Promise<IuserDocument | null> => {
  if (!id) return null

  try {
    const findUser: IuserDocument | null = await UserModel.findOne({ id })

    return findUser
  } catch (err) {
    return null
  }
}

export { userServiceFind }
