import { WASocket } from '@whiskeysockets/baileys'
import { FindUser } from '../../bot/functions/group/find-user'
import { findUserController } from '../../controllers/user/find-user'

interface IgetGroupsForUsersServices {
  jid: string
}

const userGetGroupsForUserServices = async ({
  jid,
}: IgetGroupsForUsersServices) => {
  const user = await findUserController({ jid })

  if (!user) return

  return user.Groups
}

export { userGetGroupsForUserServices }
