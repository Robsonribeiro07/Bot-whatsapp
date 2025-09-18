import { BotManager } from '../bot-manager'
import {
  ICallBacksOptions,
  IcallBacksFunctions,
  ICallBacksNames,
} from './typed-functions'

export class GroupListenerMangager {
  private bot: BotManager
  private monitoredGroup: Set<string> = new Set()
  private callBacks: Map<string, IcallBacksFunctions[]> = new Map()
  private registered = false

  constructor(bot: BotManager) {
    this.bot = bot
  }

  public addGroup({ groupId, callBack }: ICallBacksOptions) {
    if (!callBack) return
    this.monitoredGroup.add(groupId)
    if (!this.callBacks.has(groupId)) this.callBacks.set(groupId, [])
    this.callBacks.get(groupId)?.push(callBack)

    console.log(groupId, callBack, 'foram adicionando com sucesso')
    this.registerGlobalListener()
  }

  public removeGroup({ groupId, callBack }: ICallBacksOptions) {
    if (!this.monitoredGroup.has(groupId)) return

    if (callBack) {
      const filtered = this.callBacks
        .get(groupId)
        ?.filter(cb => cb !== callBack)
      if (filtered && filtered.length > 0) {
        this.callBacks.set(groupId, filtered)
      } else {
        this.callBacks.delete(groupId)
        this.monitoredGroup.delete(groupId)
      }
      return
    }

    this.callBacks.delete(groupId)
    this.monitoredGroup.delete(groupId)
  }

  private registerGlobalListener() {
    if (this.registered || !this.bot.sock) return

    this.registered = true

    this.bot.sock.ev.on('messages.upsert', ({ messages }) => {
      if (!this.bot.sock) return
      messages.forEach(msg => {
        console.log(msg)
        const jid = msg.key.remoteJid

        const fromMe = msg.key.fromMe

        if (jid && this.monitoredGroup.has(jid) && !fromMe) {
          console.log(this.callBacks.get(jid)?.forEach(cb => cb))
          this.callBacks.get(jid)?.forEach(cb => cb(msg, this.bot.sock!))
        }
      })
    })
  }
}
