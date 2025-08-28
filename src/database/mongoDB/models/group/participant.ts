import { Schema } from 'mongoose'
import { Permission } from '../../../../bot/rules/types'

export interface IParticipant {
  id: string
  admin?: 'admin' | 'superadmin'
  name: string
  profilePic: string | null
  rules: Permission[]
}

const ParticipantsSchema = new Schema<IParticipant>({
  id: { type: String, required: true },
  admin: { type: String, enum: ['admin', 'superadmin'] },
  name: { type: String },
  profilePic: { type: String, default: null },
})

export { ParticipantsSchema }
