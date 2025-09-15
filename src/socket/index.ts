import { Socket, Server as SocketServer } from 'socket.io'
import { bots } from '../database/bot/bot-manager'
import { syncHandler } from '../bot/handlers/whatsapp/syncHandle'

export const connectSockets: Record<string, Socket> = {}

let io: SocketServer

export function initSocket(server: any) {
  io = new SocketServer(server, { cors: { origin: '*' } })

  io.on('connection', socket => {
    const userId = socket.handshake.auth.userId

    connectSockets[socket.handshake.auth.userId] = socket

    const checkbox = setInterval(() => {
      const BotIntance = bots[userId]

      if (!BotIntance) return

      clearTimeout(checkbox)
      BotIntance.handleSetSocket(connectSockets[userId])
      BotIntance.GetUserData()
      syncHandler({ BotIntance, userId })
    }, 100)
  })
}
