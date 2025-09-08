import { connectSockets } from '../../socket'

interface IemitToUser {
  userId: string
  event: string
  data: any
}
export function EmitToUser({ userId, event, data }: IemitToUser) {
  const socket = connectSockets[userId]

  if (socket) {
    socket.emit(event, data)
  }
}
