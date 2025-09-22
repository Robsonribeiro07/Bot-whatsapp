import { MediaType, WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'

import { mediaMap } from './typed-media'

interface IHandlerMessageReceived {
  sock?: WASocket
  socket: Socket
}

export function handleMessageReceived({
  sock,
  socket,
}: IHandlerMessageReceived) {
  if (!sock) return
  sock.ev.on('messages.upsert', async updates => {
    for (const update of updates.messages) {
      const msg = update.message
      if (!msg) continue

      let contentType: MediaType | 'text' = 'text'
      let contentValue = ''

      for (const key in mediaMap) {
        const config = mediaMap[key]
        const content = (msg as any)[key]

        if (content) {
          contentType = config.type

          if (config.save && contentType !== 'text') {
            contentValue = await config.save(
              update,
              update.key.remoteJid!,
              contentType as MediaType,
            )
          } else {
            contentValue =
              msg.conversation || msg.extendedTextMessage?.text || ''
          }

          break
        }
      }

      const user = {
        name: update.pushName || '',
        imgUrl: await (async () => {
          try {
            return await sock.profilePictureUrl(
              update.key.remoteJid ?? '',
              'image',
            )
          } catch {
            return 'https://example.com/default-profile.png'
          }
        })(),
        id: update.key.remoteJid!,
      }

      const ts = update.messageTimestamp
      const date = ts
        ? new Date(
            typeof ts === 'number' ? ts * 1000 : ts.toNumber() * 1000,
          ).toISOString()
        : new Date().toISOString()

      const message = {
        content: contentValue,
        thumnail: msg.videoMessage?.jpegThumbnail,
        type: contentType,
        fromMe: update.key.fromMe,
        date,
        id: update.key.fromMe
          ? 'msg-' + new Date().getSeconds()
          : update.key.id,
      }

      console.log(message.type)
      const history = sock.fetchMessageHistory

      socket.emit('new-message-user-received', { user, message, history })
    }
  })
}
