import { userGetGroupsForUserServices } from '../../services/users/get-groups-for-user'

interface IgetGroupsForUsersControllers {
  jid: string
}

const getGroupsForUsersControllers = async ({
  jid,
}: IgetGroupsForUsersControllers) => {
  if (!jid) return

  return await userGetGroupsForUserServices({ jid })
}

export { getGroupsForUsersControllers }
