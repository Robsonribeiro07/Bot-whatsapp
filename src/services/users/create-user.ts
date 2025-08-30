import { IGroupSchema } from '../../database/mongoDB/models/group/group-schema'
import { IUserSchema, UserModel } from '../../database/mongoDB/user-schema'
export interface IUserSchemaServices {
  id?: string
  name: string
  number: string
}
const userServiceCreate = async ({ id, number, name }: IUserSchemaServices) => {
  if (!id || !number || !name) return

  try {
    const newUser = await UserModel.create({
      name,
      id: id ?? id,
      number,
    })

    return newUser
  } catch (err) {
    console.log(err)
  }
}

export { userServiceCreate }
