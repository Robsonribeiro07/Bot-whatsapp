import { AnyMessageContent } from '@whiskeysockets/baileys'
import { bots } from '../../database/bot/bot-manager'

type IsendMessageUser = {
  userToSendMessage: string
  message: string
  userId: string
  type: 'text' | 'img'
}

export async function sendMessageUseService({
  userId,
  userToSendMessage,
  message,
  type,
}: IsendMessageUser) {
  try {
    console.log(userId)
    const BotInstace = bots[userId]

    if (!BotInstace.sock) return

    let msgContent: AnyMessageContent = { text: '' }

    if (type === 'text') {
      msgContent = { text: message }
    } else if (type === 'img') {
      msgContent = { image: { url: message } }
    }

    const response = await BotInstace.sock?.sendMessage(
      userToSendMessage,
      msgContent,
    )

    return response
  } catch (err) {
    console.log(err)
  }
}
