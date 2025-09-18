import { Content } from '@google/genai'
import { sendMessageIA } from '../../config/gemini'

interface IsendMessage {
  content: string
}

interface IResponseSendMessage {
  code: 200 | 500
  content?: Content
}

export async function sendMessageIaService({
  content,
}: IsendMessage): Promise<IResponseSendMessage> {
  if (!content)
    return {
      code: 500,
    }

  try {
    const response = await sendMessageIA({ content })

    if (!response)
      return {
        code: 500,
      }

    return {
      code: 200,
      content: response,
    }
  } catch (err) {
    console.log(err)
    return {
      code: 500,
      content: err as Content,
    }
  }
}
