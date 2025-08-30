import path from 'path'
import fs from 'fs'
import { connectBotController } from '../../controllers/bot/connect-controller'
import { sessions } from '../../database/bot/sessions'

async function startAllBots() {
  const sessionsPath = path.join(__dirname, '../functions/sessions')

  if (!fs.existsSync(sessionsPath)) return

  const userIds = fs.readdirSync(sessionsPath)

  for (const userId of userIds) {
    if (!sessions[userId]) {
      console.log(`Reconectando bot do usuário ${userId}...`)
      const newBot = await connectBotController(userId)
      if (newBot) await newBot.connect()
    } else {
      console.log(`Bot do usuário ${userId} já está ativo em memória`)
    }
  }
}

export { startAllBots }
