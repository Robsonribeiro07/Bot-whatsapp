import OpenAI from 'openai'
import dotenv from 'dotenv'

import configJson from './config.json'
import { IAAction, IAResponse } from './typed-ia'
import { parseJsonFromAI } from '../../utils/parserJsonFromIA'
import { StreamIA } from './functions/stream'
import { handleIaResponse } from './functions/handle-IA-response'
dotenv.config()

const ia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface IsendMessageIa {
  content: string
  onChunk?: (content: string, action: IAAction) => void
  stoped: boolean
}
export async function sendMessgaeOPenIA({
  content,
  onChunk,
  stoped,
}: IsendMessageIa) {
  const response = await ia.chat.completions.create({
    model: 'gpt-4-turbo-2024-04-09',
    messages: [
      {
        role: 'user',
        content,
      },
      { role: 'system', content: JSON.stringify(configJson) },
    ],
  })

  let responseIA: IAResponse

  try {
    responseIA = parseJsonFromAI(response.choices[0].message!.content!)
  } catch {
    responseIA = {
      action: 'TEXT',
      content: response.choices[0].message.content || '',
    }
  }

  const { buffer } = handleIaResponse({
    responseIA,
    onChunk,
    stoped,
  })

  return {
    buffer,
  }
}
