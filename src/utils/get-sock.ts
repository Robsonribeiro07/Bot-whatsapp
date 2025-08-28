import { sessions } from '../database/bot/sessions'

const GetSock = (jid: string) => {
  return sessions[jid]
}
export { GetSock }
