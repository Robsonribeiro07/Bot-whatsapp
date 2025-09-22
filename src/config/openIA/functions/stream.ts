import { Socket } from 'socket.io'
import { IMessageContent, IMessaType } from '../../typed'

export type IOnChunk = (
  chunk: string,
  type: IMessaType,
  isComplete?: boolean,
) => void

interface IStream {
  content: IMessageContent
  onChunk?: IOnChunk
  shouldStop?: () => boolean
}
export function StreamIA({ content, shouldStop, onChunk }: IStream) {
  let buffer: string = ''

  const message = content.message || ''
  const length = message.length

  for (let i = 0; i < length; i++) {
    if (shouldStop?.()) {
      break
    }

    const char = message[i]
    buffer += char

    const isComplete = i === length - 1
    if (onChunk) onChunk(char, content.type, isComplete)
  }

  if (onChunk) onChunk('', content.type, true)

  return {
    buffer,
  }
}
