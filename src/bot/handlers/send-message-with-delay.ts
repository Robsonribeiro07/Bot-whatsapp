import { proto, WASocket } from '@whiskeysockets/baileys'
import { useBotStore } from '../../store/sock-store'

interface sendMessageWithDelay {
  jid: string
  text: string
  delayMS?: number
  quoted?: boolean
  msg?: proto.IWebMessageInfo
  sock: WASocket
}

const Delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function SendMessageWithDelay({
  delayMS = 500,
  quoted = false,
  jid,
  msg,
  text,
  sock,
}: sendMessageWithDelay) {
  if (!sock) return

  await Delay(delayMS)

  const options = quoted && msg ? { quoted: msg } : {}

  const msgSend = await sock.sendMessage(jid, { text }, options)

  return msgSend
}

export { SendMessageWithDelay }
