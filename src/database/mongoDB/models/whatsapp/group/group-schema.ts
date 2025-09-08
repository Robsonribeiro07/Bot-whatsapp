import { Schema } from 'mongoose'
import { IParticipant, ParticipantsSchema } from './participant'
import { IRaffleSchema, RaffleSChema } from '../../raffle-schema'

export interface IGroupSchema {
  active: boolean
  observer: boolean
  remoteJid: string
  participants: IParticipant[]
  raffles: IRaffleSchema[]
}

const GroupSchema = new Schema<IGroupSchema>({
  active: { type: Boolean, default: true },
  observer: { type: Boolean, default: true },
  participants: [ParticipantsSchema],
  remoteJid: { type: String, required: true },
  raffles: { type: [RaffleSChema] },
})

export { GroupSchema }
