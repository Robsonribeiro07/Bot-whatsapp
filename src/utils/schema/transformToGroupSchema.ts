import { IGroupSchema } from '../../database/mongoDB/models/group/group-schema'
import { GroupDTO } from '../../routes/dtos/GroupDTO'

// Recebe um array e retorna array de IGroupSchema
function transformToGroupSchemas(groupDTOs: GroupDTO[]): IGroupSchema[] {
  return groupDTOs.map(group => ({
    id: group.id,
    name: group.name,
    active: group.active,
    observer: group.observer,
    remoteJid: group.remoteJid,
    participants: group.participants || [],
    raffles: [],
  }))
}

export { transformToGroupSchemas }
