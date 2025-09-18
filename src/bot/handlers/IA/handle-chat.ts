import { Socket } from 'socket.io'
import { sendMessageIA } from '../../../config/gemini'
import { IAction } from '../../../config/typed'

interface IMessageChatIa {
  socket: Socket | undefined
}

export function MessageChatIHAandler({ socket }: IMessageChatIa) {
  if (!socket) return

  socket.on(
    'new-message',
    async ({ content, userId }: { content: string; userId: string }) => {
      await sendMessageIA({
        message: content,
        userId,
        onChunk: (chuck: string, action: IAction) => {
          socket.emit('new-message-received', { chuck, action })
        },
      })
    },
  )
}
