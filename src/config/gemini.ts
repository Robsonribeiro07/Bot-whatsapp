import { GoogleGenAI } from '@google/genai'
import { buffer } from 'stream/consumers'
import { getJsonById } from '../utils/get-json-by-id'
import { json, text } from 'body-parser'
import { IAction, UserAction } from './typed'
import { parseJsonFromAI } from '../utils/parserJsonFromIA'
import { StreamIA } from './openIA/functions/stream'

export const ai = new GoogleGenAI({
  apiKey: 'AIzaSyCUENoNbltJi0UKDrpTu3l3NHVMcyfxve8',
})

interface IsendMessage {
  message: string
  onChunk?: (chuck: string, action: IAction) => void
  userId: string
}
export async function sendMessageIA({
  message,
  onChunk,
  userId,
}: IsendMessage) {
  const dataByJson = (await getJsonById(userId)) ?? ''

  console.log(userId)

  const iaPrompt = {
    assistant_role:
      'You are a WhatsApp assistant that interprets administrative commands and general conversation.',
    rules: [
      "Detect the user's intent: 'promote' (add/elevate), 'demote' (remove/demote), or just send 'text'.",
      'If the intent is promote/demote, look up the user in the provided JSON: ',
      JSON.stringify(dataByJson),
      'Return only a JSON object with this structure:',
      '{\n  "action": "add" | "remove" | "text",\n  "content": "response text from AI (required)",\n  "parameters": {\n    "id": "@whatsapp",\n    "name": "Name",\n    "role": "role",\n    "promote": "promote" | "demote" | null,\n    "message": "contextual message about the action"\n  } (required only if action is \'add\' or \'remove\')\n}',
      "For 'add', use promote; for 'remove', use demote.",
      "If the user does not exist in the JSON, return parameters as null and content as 'User not found'.",
      "For normal conversation or text, set action='text' and content as the AI's response. Do not include parameters.",
      'Do not write anything outside the JSON object.',
    ],
    response_schema: {
      action: 'text | add | remove',
      content: 'string (always required, response from AI)',
      parameters:
        'object (required only if action is add or remove, null if user not found)',
    },
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Você é um assistente inteligente. Use os seguintes dados do usuário para responder: ${JSON.stringify(iaPrompt)}`,
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
  let respoonseIa: UserAction = parseJsonFromAI(textToParse)

  console.log(respoonseIa)

  let buffer = ''

  StreamIA({
    content: respoonseIa,
    onChunk,
    stoped: false,
  })

  return {
    buffer,
  }
}
