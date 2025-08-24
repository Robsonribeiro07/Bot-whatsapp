import { WASocket } from '@whiskeysockets/baileys'
import { RafflesStorage } from '../../../database/Raffles'
import { Rifa } from '../../../models/Rifa'
import { SendMessageWithDelay } from '../sendMessageWithDelay'
import { formatRifaMessage } from './formatterRifa'
import { useBotStore } from '../../../store/sock-store'

interface CreateRifa {
  value: string
  hour: string
  sock: WASocket
  id: string
}

interface ResponseCreateRifa {
  sucessed?: {
    message: string
  }
  Error?: {
    message: string
  }
}
const CreateNewRifa = async ({ value, hour, id }: CreateRifa): Promise<ResponseCreateRifa> => {
  const { groupId } = useBotStore.getState()

  const existiingRifa = RafflesStorage.some((r) => r.id === id || r.horario === hour)

  if (existiingRifa) {
    SendMessageWithDelay({ delayMS: 500, jid: '120363420435813452@g.us', text: 'Rifa ja existe' })
    return {
      Error: { message: 'Rifa ja existe' },
    }
  }

  const newRifa = new Rifa(id, Number(value), hour)

  const messageFormated = formatRifaMessage(newRifa)

  const msgSent = await SendMessageWithDelay({ text: messageFormated, jid: groupId })

  newRifa.messageId.push(msgSent!.key!.id!)

  RafflesStorage.push(newRifa)

  return { sucessed: { message: messageFormated } }
}

export { CreateNewRifa }
