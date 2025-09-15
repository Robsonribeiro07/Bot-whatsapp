import { BotManager } from '../../functions/create-bot'
import {
  conctact,
  synchronizeContacts,
} from '../../functions/whatsapp/get-conctcts-data'

interface ISyncHandler {
  userId: string
  BotIntance: BotManager
}
export function syncHandler({ userId, BotIntance }: ISyncHandler) {
  let initializUplouad = false
  if (!userId || !BotIntance) return

  BotIntance.socket?.on(
    'start-sync',
    async ({ contacts }: { contacts: conctact[] }) => {
      if (!contacts) return
      try {
        if (initializUplouad) return
        const { failedContacts, successContacts } = await synchronizeContacts({
          contacts,
          sock: BotIntance.sock,
          socket: BotIntance.socket,
        })

        BotIntance.socket?.emit('finished-uploading-contacts', {
          failedContacts,
          successContacts,
        })

        initializUplouad = true
      } catch (err) {
        BotIntance.socket?.emit('Error-uploading-contacts')
        initializUplouad = false
      }
    },
  )
}
