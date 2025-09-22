import { GoogleGenAI } from '@google/genai'
import { getJsonById } from '../utils/get-json-by-id'
import { parseJsonFromAI } from '../utils/parserJsonFromIA'
import { executeAction } from './gemini/functions/execute-by-action'
import promptByIA from './prompt.json'
import { IOnChunk } from './openIA/functions/stream'
import { UserAction } from './typed'

export const ai = new GoogleGenAI({
  apiKey: 'AIzaSyCUENoNbltJi0UKDrpTu3l3NHVMcyfxve8',
})

interface IsendMessage {
  message: string
  onChunk?: IOnChunk
  userId: string
  stopState: { stoped: boolean }
}
export async function sendMessageIA({
  message,
  onChunk,
  userId,
  stopState,
}: IsendMessage) {
  try {
    const dataByJson = (await getJsonById(userId)) ?? ''

    const shouldStop = () => stopState.stoped

    const iaPrompt = {
      placeholders: {
        users: JSON.stringify(dataByJson),
        SystemPrompt: JSON.stringify(promptByIA),
      },
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: ` user Data ${JSON.stringify(iaPrompt.placeholders.users)}`,
            },
            {
              text: ` use these placeholders ${JSON.stringify(iaPrompt.placeholders.SystemPrompt)}`,
            },
          ],
        },
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
    })

    let textToParse: string
    let content = response.candidates![0].content?.parts ?? ''

    if (Array.isArray(content)) {
      textToParse = content.map(part => part.text).join('\n')
    } else {
      textToParse = content
    }
    let responseByIA: UserAction = parseJsonFromAI(textToParse)

    executeAction({ action: responseByIA, onChunk, shouldStop })

    let buffer = ''

    return {
      buffer,
    }
  } catch (err) {
    console.log(err)
  }
}
