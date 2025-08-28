import { createBot } from '../../bot/functions/create-bot'
import { sessions } from '../../database/bot/sessions'
import { findUserController } from '../user/find-user'

async function connectBotController(jid: string) {
  const findUser = await findUserController({ jid })

  if (!findUser) return

  if (sessions[jid.toString()]) {
    console.log('user Conectado')
  }

  const newBot = await createBot(findUser._id.toString())

  return newBot
}

export { connectBotController }
