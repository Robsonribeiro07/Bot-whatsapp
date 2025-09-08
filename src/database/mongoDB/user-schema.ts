import mongoose, { Document, Schema } from 'mongoose'
import { GroupSchema, IGroupSchema } from './models/whatsapp/group/group-schema'
import { IuserSchemaWhatsapp, UserSchemaWhatsapp } from './models/user-schema'

export interface IUserSchema extends Document {
  id: string
  Groups?: IGroupSchema[]
  WhatsappData?: Partial<IuserSchemaWhatsapp>
  _id: string
}

const UserSchema = new Schema<IUserSchema>({
  id: { type: String, default: '', unique: true },
  Groups: { type: [GroupSchema], default: [] },
  WhatsappData: { type: UserSchemaWhatsapp, default: null },
})

const UserModel = mongoose.model<IUserSchema>('Users', UserSchema)

export { UserModel }
