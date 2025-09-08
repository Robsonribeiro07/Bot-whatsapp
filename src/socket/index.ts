import { Socket, Server as SocketServer } from 'socket.io'

export const connectSockets: Record<string, Socket> = {}

let io: SocketServer

export function initSocket(server: any) {
  io = new SocketServer(server, { cors: { origin: '*' } })

  io.on('connection', socket => {
    console.log('client conectado', socket.id)

    socket.on('register', (userId: string) => {
      console.log(`userid ${userId}`)
      connectSockets[userId] = socket
    })
  })
}
