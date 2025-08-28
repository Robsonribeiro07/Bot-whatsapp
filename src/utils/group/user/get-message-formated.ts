import { proto, WASocket } from '@whiskeysockets/baileys'
import { SendMessageWithDelay } from '../../../bot/handlers/send-message-with-delay'

interface IGetMessageFormated {
  sock: WASocket
  msg: proto.IWebMessageInfo
  args?: string[]
  withNone?: boolean
}

interface IResultMessageFormated {
  result: string
  withNone: boolean
}

const GetMessageFormatedNumber = async ({
  msg,
  sock,
  args,
}: IGetMessageFormated): Promise<IResultMessageFormated | undefined> => {
  if (!msg) return

  const groupId = msg.key.remoteJid
  const result =
    msg?.message?.extendedTextMessage?.contextInfo?.participant ||
    (args && args[0] ? args[0].replace(/\D/g, '') : undefined)

  if (!result) return

  if (result.includes('9') && groupId) {
    await SendMessageWithDelay({
      jid: groupId,
      text: 'Por favor retire o número 9 e tente novamente',
      sock,
    })

    return {
      result,
      withNone: true,
    }
  }

  return {
    result,
    withNone: false,
  }
}

export { GetMessageFormatedNumber }
