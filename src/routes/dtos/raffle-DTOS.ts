import { Bilhete } from '../../models/Rifa'

export interface RaffleDTO {
  raffleId: string
  value: number
  date: string
  Bilhetes: Bilhete[]
  messageId: string[]
  closed: boolean
  name: String
}
