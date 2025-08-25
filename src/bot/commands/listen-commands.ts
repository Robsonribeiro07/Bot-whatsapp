import { proto } from '@whiskeysockets/baileys'
import { useBotStore } from '../../store/sock-store'
import { TicketsAvaliables } from './Raffle/ticket-avaliables'
import { closeGroup } from './group/closed-group'
import { OpenGroup } from './group/open-group'

type commandFn = (msg: proto.IWebMessageInfo) => Promise<unknown>
const coomands: Record<string, commandFn> = {
  '!disponivel': TicketsAvaliables,
  '!fechar': closeGroup,
  '!abrir': OpenGroup,
}
const listenCommands = async () => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock) return

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]

    if (msg.key.remoteJid !== groupId) return

    const text = msg.message?.conversation ?? ''

    if (!text.startsWith('!')) return

    const fn = coomands[text.toLowerCase()]

    if (fn) await fn(msg)
  })
}

export { listenCommands }
