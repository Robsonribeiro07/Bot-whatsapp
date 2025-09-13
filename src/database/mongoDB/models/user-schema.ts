import { Schema, Document } from 'mongoose'

interface IGroupParticipant {
  id: string
  isAdmin: boolean
  isSuperAdmin: boolean
  imgUrl?: string
}

export interface IGroup {
  id: string
  subject: string
  creation: number
  owner: string
  imgUrl?: string
  participants: IGroupParticipant[]
}

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
  groups?: IGroup[]
}

const GroupParticipantSchema = new Schema<IGroupParticipant>(
  {
    id: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isSuperAdmin: { type: Boolean, required: true },
    imgUrl: { type: String },
  },
  { _id: false },
)

const GroupSchema = new Schema<IGroup>(
  {
    id: { type: String, required: true },
    subject: { type: String, required: true },
    creation: { type: Number, required: true },
    owner: { type: String, required: true },
    participants: { type: [GroupParticipantSchema], default: [] },
    imgUrl: { type: String, default: undefined },
  },
  { _id: false },
)

const UserSchemaWhatsapp = new Schema<IuserSchemaWhatsapp>({
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
  jid: { type: String, default: null },
  imgUrl: { type: String, default: null },
  status: { type: String, default: null },
  groups: { type: [GroupSchema], default: [] },
})

export { UserSchemaWhatsapp }
