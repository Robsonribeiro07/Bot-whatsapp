import { Request, Response } from 'express'
import { userServiceFind } from '../../services/users/find-user'

interface IFindUser {
  jid: string
}

const findUserController = async ({ jid }: IFindUser) => {
  if (!jid) return

  return await userServiceFind({ jid })
}

export { findUserController }
