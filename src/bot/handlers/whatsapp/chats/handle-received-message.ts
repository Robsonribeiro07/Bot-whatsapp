import { MediaType, WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'

import { mediaMap } from './typed-media'
import { GetMessagetext } from './get-messagetext'

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

      if (msg.conversation) {
        contentValue = msg.conversation
      } else if (msg.extendedTextMessage?.text) {
        contentValue = msg.extendedTextMessage.text
      }
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
        mimyType: msg.videoMessage?.mimetype,
        gifPlayback: msg.videoMessage?.gifPlayback,
        date,
        id: update.key.id!,
      }

      socket.emit('new-message-user-received', { user, message })
    }
  })
}
