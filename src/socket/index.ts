import { Socket, Server as SocketServer } from 'socket.io'
import { bots } from '../database/bot/bot-manager'

export const connectSockets: Record<string, Socket> = {}

let io: SocketServer

export function initSocket(server: any) {
  io = new SocketServer(server, { cors: { origin: '*' } })

  io.on('connection', socket => {
    console.log(connectSockets)
    const userId = socket.handshake.auth.userId
    console.log('client-conectadoo', socket.handshake.auth.userId)

    connectSockets[socket.handshake.auth.userId] = socket

    const bot = bots[userId]

    if (bot) {
      console.log('bot enviado')
      bot.handleSetSocket(connectSockets[userId])
      bot.GetUserData()
    }
  })
}
