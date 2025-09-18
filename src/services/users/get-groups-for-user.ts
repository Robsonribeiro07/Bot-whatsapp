import { userServiceFind } from './find-user'

interface IgetGroupsForUsersServices {
  jid: string
}

const userGetGroupsForUserServices = async ({
  jid,
}: IgetGroupsForUsersServices) => {
  const user = await userServiceFind({ id: jid })

  if (!user) return

  return user.Groups
}

export { userGetGroupsForUserServices }
