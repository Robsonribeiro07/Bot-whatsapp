import { WASocket } from '@whiskeysockets/baileys'
import { mapGroupsMetadataToIGroup } from '../../../utils/group/map-groups-metadada-to-igroup'

interface IGetUpdateGroup {
  sock: WASocket
  groupId: string
}

export async function getUpdateGroup({ sock, groupId }: IGetUpdateGroup) {
  if (!sock || !groupId) return

  try {
    const findGroup = await sock.groupMetadata(groupId)
    const response = await mapGroupsMetadataToIGroup(sock, [findGroup])

    return response
  } catch (err) {
    return null
  }
}
