import { proto } from '@whiskeysockets/baileys'

function getMessageHour(msg: proto.IWebMessageInfo): string {
  const timestamp = msg.messageTimestamp
  const date = new Date(Number(timestamp) * 1000)

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

export { getMessageHour }
