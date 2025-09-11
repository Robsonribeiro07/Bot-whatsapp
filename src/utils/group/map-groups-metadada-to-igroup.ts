import { GroupMetadata, WASocket } from '@whiskeysockets/baileys'
import { IGroup } from '../../database/mongoDB/models/user-schema'

export async function mapGroupsMetadataToIGroup(
  sock: WASocket,
  groups: GroupMetadata[],
): Promise<IGroup[]> {
  return await Promise.all(
    groups.map(async g => {
      let imgUrl: string | undefined = undefined

      try {
        imgUrl = await sock.profilePictureUrl(g.id, 'image')
      } catch (err) {
        imgUrl = undefined
      }

      return {
        id: g.id,
        subject: g.subject ?? 'unknowm',
        creation: g.creation ?? Date.now(),
        owner: g.owner ?? '',
        imgUrl: imgUrl ?? '',
        participants: g.participants.map(p => ({
          id: p.id,
          isAdmin: p.admin === 'admin' || p.admin === 'superadmin',
          isSuperAdmin: p.admin === 'superadmin',
        })),
      }
    }),
  )
}
