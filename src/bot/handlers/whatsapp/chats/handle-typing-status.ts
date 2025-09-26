import { WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'

interface IHandlerUpdateStatus {
  sock?: WASocket
  socket: Socket
}
export function HandlerTypingStatus({ sock, socket }: IHandlerUpdateStatus) {
  if (!sock) {
    console.warn('Sock not initialized for typing status handler')
    return
  }

  socket.on('start-typing', ({ userIdtemp }: { userIdtemp: string }) => {
    sock.sendPresenceUpdate('composing', userIdtemp)
  })

  socket.on('stop-typing', ({ userIdtemp }: { userIdtemp: string }) => {
    console.log('parou de digitar')
    sock.sendPresenceUpdate('paused', userIdtemp)
  })
}
