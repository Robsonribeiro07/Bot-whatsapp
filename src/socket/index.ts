import { Socket, Server as SocketServer } from 'socket.io'
import { bots } from '../database/bot/bot-manager'
import { syncHandler } from '../bot/handlers/whatsapp/contacts/syncHandle'
import { MonitorReplySentRifa } from '../bot/handlers/Group/monitor-reply-sent-message'
import { MessageChatIHAandler } from '../bot/handlers/IA/handle-chat'

export const connectSockets: Record<string, Socket> = {}

let io: SocketServer

export function initSocket(server: any) {
  io = new SocketServer(server, { cors: { origin: '*' } })

  io.on('connection', socket => {
    const userId = socket.handshake.auth.userId

    console.log('client conectado', userId)

    connectSockets[socket.handshake.auth.userId] = socket

    const checkbox = setInterval(() => {
      const BotIntance = bots[userId]

      if (!BotIntance) return

      clearTimeout(checkbox)

      BotIntance.handleSetSocket(connectSockets[userId])
      MessageChatIHAandler({ socket: connectSockets[userId] })

      syncHandler({ BotIntance, userId })

      BotIntance.groupListener?.addGroup({
        groupId: '120363400110181560@g.us',
        callBack: MonitorReplySentRifa,
      })
    }, 100)
  })
}
