import { WASocket } from '@whiskeysockets/baileys'
import { Schema } from 'mongoose'

export interface IuserSchemaWhatsapp extends Document {
  id: string
  name?: string
  verifiedName: string
  notify: string
  connectedAt: Date
}

const UserSchemaWhatsapp = new Schema<IuserSchemaWhatsapp>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    verifiedName: { type: String },
    notify: { type: String },
    connectedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
  },
)

export { UserSchemaWhatsapp }
