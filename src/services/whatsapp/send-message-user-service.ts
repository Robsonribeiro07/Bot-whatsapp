import { AnyMessageContent } from '@whiskeysockets/baileys'
import { bots } from '../../database/bot/bot-manager'
import { MediaType, messageBuilder } from './typed-media-map'

export type IsendMessageUser = {
  userToSendMessage: string
  message: string
  userId: string
  type: MediaType
}

export async function sendMessageUseService({
  userId,
  userToSendMessage,
  message,
  type,
}: IsendMessageUser) {
  try {
    const BotInstace = bots[userId]

    if (!BotInstace.sock) return

    let msgContent: AnyMessageContent = { text: '' }

    msgContent = await messageBuilder[type](message, userId)

    const response = await BotInstace.sock?.sendMessage(
      userToSendMessage,
      msgContent,
    )

    return response
  } catch (err) {
    console.log(err)
    return err
  }
}
