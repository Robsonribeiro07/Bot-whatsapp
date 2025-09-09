import { WASocket } from '@whiskeysockets/baileys'
import { Schema } from 'mongoose'

export interface IuserSchemaWhatsapp extends Document {
  id: string
  name?: string
  verifiedName: string
  notify: string
  connectedAt: Date
  lid: string
  jid: string
  imgUrl: string
  status: string
}

const UserSchemaWhatsapp = new Schema<IuserSchemaWhatsapp>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      default: null,
    },
    name: { type: String },
    verifiedName: { type: String },
    notify: { type: String },
    connectedAt: { type: Date, default: Date.now },
    lid: { type: String, default: null },
    jid: { type: String, defaul: null },
    imgUrl: { type: String, default: null },
    status: { type: String, default: null },
  },
  {
    _id: false,
  },
)

export { UserSchemaWhatsapp }
