import { IParticipant } from '../../database/mongoDB/models/group/participant'
import { RaffleDTO } from './raffle-DTOS'

// src/dtos/GroupDTO.ts
export interface GroupDTO {
  id: string
  active: boolean
  observer: boolean
  remoteJid: string
  name: string
  participants?: IParticipant[]
  raffles: RaffleDTO[]
}
