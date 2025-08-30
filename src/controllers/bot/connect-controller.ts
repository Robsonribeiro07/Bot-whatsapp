import { BotManager } from '../../bot/functions/create-bot'
import { sessions } from '../../database/bot/sessions'
import { userServiceFind } from '../../services/users/find-user'

async function connectBotController(jid: string) {
  const findUser = await userServiceFind({ jid })

  if (!findUser) return

  if (sessions[jid.toString()]) {
    console.log('user Conectado')
  }

  const newBot = new BotManager(jid)

  newBot.connect()
  return newBot
}

export { connectBotController }
