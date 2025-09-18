import { BotManager } from '../../bot/manager/bot-manager'
import { getOrCreateBot } from '../../database/bot/bot-manager'
import { sessions } from '../../database/bot/sessions'
import { userServiceFind } from '../../services/users/find-user'

async function connectBotController(id: string) {
  const findUser = await userServiceFind({ id })

  if (!findUser) return

  if (sessions[id]) {
    console.log('user Conectado')
  }

  const bot = getOrCreateBot({ id })

  return bot
}

export { connectBotController }
