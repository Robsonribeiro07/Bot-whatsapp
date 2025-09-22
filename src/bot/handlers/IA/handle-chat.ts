import { Socket } from 'socket.io'
import { sendMessageIA } from '../../../config/gemini'
import { IMessaType } from '../../../config/typed'

interface IMessageChatIa {
  socket: Socket | undefined
}

export function MessageChatIHAandler({ socket }: IMessageChatIa) {
  if (!socket) return

  const stopState = { stoped: false }

  socket.on(
    'new-message',
    async ({ content, userId }: { content: string; userId: string }) => {
      stopState.stoped = false
      await sendMessageIA({
        message: content,
        userId,
        stopState,

        onChunk: (chuck: string, type: IMessaType, isComplete) => {
          socket.emit('new-message-received', { chuck, type, isComplete })
        },
      })
    },
  )

  socket.on('stoped', () => {
    console.log('chegou para  parar')
    stopState.stoped = true
  })
}
