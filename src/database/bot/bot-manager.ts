import { BotManager } from '../../bot/manager/bot-manager'

interface IGetOrcreateBot {
  id: string
}
export const bots: Record<string, BotManager> = {}

export async function getOrCreateBot({ id }: IGetOrcreateBot) {
  if (!bots[id]) {
    const bot = new BotManager(id)
    bots[id] = bot
    await bot.connect()
  }

  return bots[id]
}
