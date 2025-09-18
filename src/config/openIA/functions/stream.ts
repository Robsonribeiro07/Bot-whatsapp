import { IAction, UserAction } from '../../typed'

interface IStream {
  content: UserAction
  onChunk?: (chuck: string, action: IAction) => void
  stoped: boolean
}
export function StreamIA({ content, stoped, onChunk }: IStream) {
  let buffer: string = ''

  for (const char of content.content || '') {
    if (stoped) break

    buffer += char
    if (onChunk) onChunk(char, content.action)
  }

  return {
    buffer,
  }
}
