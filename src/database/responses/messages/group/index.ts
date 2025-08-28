import { proto, WASocket } from '@whiskeysockets/baileys'
import { SendMessageWithDelay } from '../../../../bot/handlers/send-message-with-delay'
import { IMessages, MessageErros } from './erros/message'
import { IMessagesSucess, MessageSucess } from './sucess/message'
import { MessageType } from 'venom-bot'

interface IAllResponseMessages {
  Erros: IMessages
  Sucess: IMessagesSucess
}

const AllResponseMessages: IAllResponseMessages = {
  Erros: MessageErros,
  Sucess: MessageSucess,
}

interface ISendResponse<T extends keyof IAllResponseMessages> {
  message: keyof IAllResponseMessages[T]
  msg: proto.IWebMessageInfo
  typeMessage: T
  personalizedMessage?: string
  sock: WASocket
}

const SendResponseGroup = async <T extends keyof IAllResponseMessages>({
  message,
  msg,
  personalizedMessage,
  typeMessage,
  sock,
}: ISendResponse<T>) => {
  const groupdId = msg.key.remoteJid

  if (!groupdId) return

  const messageType = AllResponseMessages[typeMessage]

  const sendMessage = messageType[message]

  const messageForSend = personalizedMessage
    ? `${sendMessage} ${personalizedMessage}`
    : (sendMessage as string)

  if (!messageForSend) return

  return await SendMessageWithDelay({
    jid: groupdId,
    text: messageForSend,
    sock,
  })
}

export { SendResponseGroup }
