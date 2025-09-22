import { WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'
import { getUpdateGroup } from '../../../functions/group/get-update-group'

type IGroupUpdateJob = { groupId: string; sock: WASocket }

const groupUpdateQueue: IGroupUpdateJob[] = []
let isProcessingQueue = false

async function processQueue(socket: Socket) {
  if (isProcessingQueue) return
  isProcessingQueue = true

  try {
    while (groupUpdateQueue.length > 0) {
      const job = groupUpdateQueue.shift()!

      try {
        const response = await getUpdateGroup({
          sock: job.sock,
          groupId: job.groupId,
        })

        console.log(response)

        if (response) {
          console.log('group update', response[0].owner)
          socket.emit('have-to-update', { data: response })
        }
      } catch (err) {
        console.error(err)
      }
      await new Promise(res => setTimeout(res, 100))
    }
  } finally {
    isProcessingQueue = false
  }
}
interface IupdateUser {
  socket: Socket | undefined
  sock: WASocket | undefined
}

export function EmitToHaveUpdate({ sock, socket }: IupdateUser) {
  if (!sock?.user || !socket) return null

  sock.ev.on('messages.upsert', async update => {
    for (const msg of update.messages) {
      const groupId = msg.key.remoteJid
      const content = msg.message

      if (!groupId) return
      groupUpdateQueue.push({ groupId, sock })
    }

    await processQueue(socket)
  })
  sock.ev.on('groups.update', async updates => {
    if (!sock || !Array.isArray(updates)) return

    for (const update of updates) {
      const groupId = update.id

      if (!groupId) continue
      groupUpdateQueue.push({ groupId, sock })
    }

    await processQueue(socket)
  })
}
