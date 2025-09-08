import { UserModel } from '../../database/mongoDB/user-schema'
import { userServiceFind } from './find-user'
export interface IUserSchemaServices {
  id: string
}
const userServiceCreate = async ({ id }: IUserSchemaServices) => {
  if (!id) return null

  const findExistingUser = await userServiceFind({ id })

  if (findExistingUser) return findExistingUser

  try {
    const newUser = await UserModel.create({
      id,
    })

    return newUser
  } catch (err) {
    console.log(err)

    return null
  }
}

export { userServiceCreate }
