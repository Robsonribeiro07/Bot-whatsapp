import { getUserPermissionsService } from '../../services/group/get-user-permission'
import { IsWhatasappAdmin } from './group-rules'
import { PermissionOptins } from './types'

interface IHasPermission {
  opts: PermissionOptins
}

const hasPermission = async ({ opts }: IHasPermission) => {
  const WhatasappAdmin = await IsWhatasappAdmin({
    participantID: opts.participationID,
    remoteJid: opts.remoteJid,
    sock: opts.sock,
  })

  if (WhatasappAdmin) return true

  const custom = await getUserPermissionsService({
    remoteJid: opts.remoteJid,
    participantID: opts.participationID,
    userID: opts.userId,
  })

  return custom?.includes(opts.required)
}

export { hasPermission }
