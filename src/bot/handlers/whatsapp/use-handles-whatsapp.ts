import { WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'
import { EmitToHaveUpdate } from './group/update-group'
import { synchronizeContacts } from './contacts/get-conctcts-data'
import { syncHandler } from './contacts/syncHandle'
import { BotManager } from '../../manager/bot-manager'
import { handleMessageReceived } from './chats/handle-received-message'
import { HandlerTypingStatus } from './chats/handle-typing-status'

interface IHandlersWhatsapp {
  sock?: WASocket
  socket: Socket
  BotIntance?: BotManager
  userId: string
}

export function HandlerWhatsapp({
  sock,
  socket,
  BotIntance,
  userId,
}: IHandlersWhatsapp) {
  if (!sock || !BotIntance) return

  EmitToHaveUpdate({ sock, socket })
  syncHandler({ BotIntance, userId })
  handleMessageReceived({ sock: BotIntance.sock, socket })
  HandlerTypingStatus({ sock: BotIntance.sock, socket })
}
