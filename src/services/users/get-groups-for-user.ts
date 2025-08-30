import { WASocket } from '@whiskeysockets/baileys'
import { FindUser } from '../../bot/functions/group/find-user'
import { userServiceFind } from './find-user'

interface IgetGroupsForUsersServices {
  jid: string
}

const userGetGroupsForUserServices = async ({
  jid,
}: IgetGroupsForUsersServices) => {
  const user = await userServiceFind({ jid })

  if (!user) return

  return user.Groups
}

export { userGetGroupsForUserServices }
