import { RafflesStorage } from '../../../database/Raffles'
import { SendMessageWithDelay } from '../sendMessageWithDelay'
import { proto } from '@whiskeysockets/baileys'

interface IReservedNumber {
  assinante: string
  RifaId?: string | null
  numbers?: number[]
  groupId: string
  msg?: proto.IWebMessageInfo
}

const reserveNumbers = ({
  assinante,
  numbers,
  msg,
  groupId,
  RifaId,
}: IReservedNumber) => {
  if (!numbers || numbers.length === 0) return

  const raffle = RafflesStorage.find(r => r.messageId.some(id => id === RifaId))

  if (!raffle) {
    return SendMessageWithDelay({
      text: 'Esta Rifa nao existe ou ja foi encerrada',
      jid: groupId,
    })
  }

  const reservedSuccess: number[] = []
  const reservedFailed: number[] = []

  numbers.forEach(n => {
    const success = raffle.reservedNumber(n, assinante)
    if (success) {
      reservedSuccess.push(n)
    } else {
      reservedFailed.push(n)
    }
  })

  let reply = ''
  if (reservedSuccess.length > 0)
    reply += `✅ Números reservados: ${reservedSuccess.join(', ')}\n`
  if (reservedFailed.length > 0)
    reply += `❌ Números indisponíveis: ${reservedFailed.join(', ')}`

  console.log(raffle)
  return SendMessageWithDelay({ text: reply, jid: groupId, quoted: true, msg })
}

export { reserveNumbers }
