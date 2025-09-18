import { listenCommands } from './commands/listen-commands'
import { MonitorGroup } from './handlers/message-handlers'
import { startAllBots } from './handlers/startBot'
import { sessions } from '../database/bot/sessions'
import { userGetGroupsForUserServices } from '../services/users/get-groups-for-user'

export async function main() {
  await startAllBots()
  for (const userId of Object.keys(sessions)) {
    const sock = sessions[userId]

    if (!sock) return

    const GroupsMonitor = await userGetGroupsForUserServices({ jid: userId })

    listenCommands()

    if (GroupsMonitor) {
      for (const group of GroupsMonitor) {
        MonitorGroup({ sock, groupId: group.remoteJid })
      }
    }
  }
}
