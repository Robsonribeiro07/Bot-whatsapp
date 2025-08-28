import { IGroupSchema } from '../../database/mongoDB/models/group/group-schema'
import { IUserSchema, UserModel } from '../../database/mongoDB/user-schema'
export interface IUserSchemaServices {
  id?: string
  name: string
  number: string
  groups?: IGroupSchema
}
const userServiceCreate = async ({
  id,
  number,
  name,
  groups,
}: IUserSchemaServices) => {
  if (!id || !number || !name) return

  try {
    const newUser = await UserModel.create({
      name,
      id: id ?? id,
      number,
      Groups: groups,
    })

    return newUser
  } catch (err) {
    console.log(err)
  }
}

export { userServiceCreate }
