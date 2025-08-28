import mongoose, { Mongoose, Schema } from 'mongoose'
import { GroupSchema, IGroupSchema } from './models/group/group-schema'

export interface IUserSchema {
  id?: string
  name: string
  number: string
  Groups?: IGroupSchema[]
  _id: string
}

const UserSchema = new Schema<IUserSchema>({
  id: { type: String, required: true },
  Groups: { type: [GroupSchema], default: [] },
})

const UserModel = mongoose.model<IUserSchema>('Rifa', UserSchema)

export { UserModel }
