import { IAAction, IAResponse } from '../typed-ia'
import { StreamIA } from './stream'

interface IHandleOptions {
  responseIA: IAResponse
  stoped: boolean
  onChunk?: (chuck: string, action: IAAction) => void
}

export function handleIaResponse({
  responseIA,
  stoped,
  onChunk,
}: IHandleOptions) {
  let buffer = ''

  if (responseIA.action === 'GET_CONTACTS') {
    return {
      buffer,
    }
  }

  if (responseIA.content) {
    const { buffer: bufferStream } = StreamIA({
      onChunk,
      content: responseIA,
      stoped,
    })

    buffer = bufferStream
  }

  return {
    buffer,
  }
}
