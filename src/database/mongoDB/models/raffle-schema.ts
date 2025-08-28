import mongoose, { Schema, Document } from 'mongoose'
import { Bilhete } from '../../../models/Rifa'

export interface IRaffleSchema extends Document {
  raffleId: string
  value: number
  date: string
  Bilhetes: Bilhete[]
  messageId: string[]
  closed: boolean
  name: String
}

const TicketsSchema = new Schema<Bilhete>({
  Number: { type: Number, required: true },
  User: { type: String, default: null },
  ReservedBy: { type: Boolean },
})

export const RaffleSChema = new Schema<IRaffleSchema>({
  raffleId: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: String, required: true },
  Bilhetes: { type: [TicketsSchema], default: [] },
  name: { type: String },
})

RaffleSChema.pre('save', function (next) {
  if (this.Bilhetes.length === 0) {
    this.Bilhetes = Array.from({ length: 100 }, (_, i) => ({
      Number: i + 1,
      User: null,
      ReservedBy: false,
    }))
  }
  next()
})
