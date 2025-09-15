import { WASocket } from '@whiskeysockets/baileys'
import { Socket } from 'socket.io'
import { FormatNumber } from '../../../utils/group/user/format-numbers'

export type conctact = {
  name: string
  number: string
}
interface ISynchronizeContacts {
  sock: WASocket | undefined
  socket: Socket | undefined
  contacts: conctact[]
}

interface ContactData {
  contact: conctact
  [key: string]: any
}

export async function synchronizeContacts({
  sock,
  socket,
  contacts,
}: ISynchronizeContacts) {
  const successContacts: ContactData[] = []
  const failedContacts: { contact: conctact; error: string }[] = []

  if (!sock || !socket) {
    return { failedContacts, successContacts }
  }

  socket.emit('started-loadings')

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]

    socket.emit('contact-loading', {
      contact,
      index: i,
      total: contacts.length,
      status: 'loading',
    })

    try {
      const contactData = await sock.onWhatsApp(contact.number)

      if (!contactData || contactData.length === 0) {
        failedContacts.push({ contact, error: 'Contato não encontrado' })
        socket.emit('contact-loaded', {
          contact,
          index: i,
          status: 'failed',
          error: 'Contato não encontrado',
        })
        continue
      }

      let imgUrl: string | undefined = undefined
      try {
        imgUrl = await sock.profilePictureUrl(contactData[0].jid, 'image')
      } catch {
        imgUrl = undefined
      }

      successContacts.push({ contact, ...contactData[0] })

      console.log(contactData[0].jid)

      socket.emit('contact-loaded', {
        contact,
        index: i,
        status: 'success',
        data: {
          contactData: contactData[0],
          name: contact.name,
          imgUrl,
          number: contactData[0].jid,
        },
      })
    } catch (err) {
      failedContacts.push({ contact, error: (err as Error).message })
      socket.emit('contact-loaded', {
        contact,
        index: i,
        status: 'failed',
        error: (err as Error).message,
      })
    }
  }

  return { failedContacts, successContacts }
}
