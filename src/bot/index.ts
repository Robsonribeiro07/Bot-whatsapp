import { useBotStore } from '../store/sock-store'
import { listenCommands } from './commands'
import { MonitorGroup } from './handlers/messageHandleres'
import { StartBot } from './handlers/startBot'

async function main() {
  const sock = await StartBot()

  const { setSock } = useBotStore.getState()

  setSock(sock)

  const groupId = '120363420435813452@g.us'

  listenCommands()

  MonitorGroup({ sock, groupId })
}

main()
