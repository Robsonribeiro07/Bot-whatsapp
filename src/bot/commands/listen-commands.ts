import { proto, WASocket } from '@whiskeysockets/baileys'
import { useBotStore } from '../../store/sock-store'
import { TicketsAvaliables } from './Raffle/ticket-avaliables'
import { closeGroup } from './group/closed-group'
import { OpenGroup } from './group/open-group'
import { RemoverUser } from './group/users/remover-user'
import { AddUser } from './group/users/add-user'

type commandFn = (
  sock: WASocket,
  msg?: proto.IWebMessageInfo,
  args?: string[],
) => Promise<unknown>
const coomands: Record<string, commandFn> = {
  '!disponivel': TicketsAvaliables,
  '!fechar': closeGroup,
  '!abrir': OpenGroup,
  '!banir': RemoverUser,
  '!add': AddUser,
}
const listenCommands = async () => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock) return

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]

    if (msg.key.remoteJid !== groupId) return

    const text =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? ''

    if (!text.startsWith('!')) return

    const parts = text.trim().split(/\s+/)

    const command = parts[0].toLowerCase()

    const args = parts.slice(1)

    const fn = coomands[command]

    if (fn) await fn(sock, msg, args)
  })
}

export { listenCommands }
