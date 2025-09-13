import { GroupMetadata, WASocket } from '@whiskeysockets/baileys'
import { IGroup } from '../../database/mongoDB/models/user-schema'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

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
        imgUrl = ''
      }

      const participants = []
      for (const p of g.participants) {
        try {
          const participantImg = await sock
            .profilePictureUrl(p.id, 'image')
            .catch(() => '')
          participants.push({
            id: p.id,
            isAdmin: p.admin === 'admin' || p.admin === 'superadmin',
            isSuperAdmin: p.admin === 'superadmin',
            imgUrl: participantImg,
          })
          await delay(500)
        } catch (err) {
          console.log(`Erro ao buscar foto do participante ${p.id}:`)
          participants.push({
            id: p.id,
            isAdmin: p.admin === 'admin' || p.admin === 'superadmin',
            isSuperAdmin: p.admin === 'superadmin',
            imgUrl: '',
          })
        }
      }

      return {
        id: g.id,
        subject: g.subject ?? 'unknown',
        creation: g.creation ?? Date.now(),
        owner: g.owner ?? '',
        imgUrl: imgUrl ?? '',
        participants,
      }
    }),
  )
}
