import { useStore } from 'zustand'
import { RafflesStorage } from '../../../../database/raffle-storage'
import { SendMessageWithDelay } from '../../send-message-with-delay'
import { proto, WASocket } from '@whiskeysockets/baileys'
import { useBotStore } from '../../../../store/sock-store'
import { SendMessageSucessedReserved } from './send-message-sucessed-reserved'

interface IReservedNumber {
  sock: WASocket
  assinante: string
  RifaId?: string | null
  numbers?: number[]
  groupId: string
  msg?: proto.IWebMessageInfo
}

const reserveNumbers = async ({
  assinante,
  numbers,
  msg,
  groupId,
  RifaId,
  sock,
}: IReservedNumber) => {
  if (!numbers || numbers.length === 0) return

  const raffle = RafflesStorage.find(r => r.messageId.some(id => id === RifaId))

  console.log(msg?.message?.conversation)

  if (!raffle) return

  const reservedSuccess: number[] = []
  const reservedFailed: number[] = []

  numbers.forEach(async n => {
    const success = raffle?.reservedNumber(n, assinante)
    if (success) {
      reservedSuccess.push(n)

      return await SendMessageSucessedReserved({ groupId, msg })
    } else {
      return reservedFailed.push(n)
    }
  })

  let reply = ''
  if (reservedSuccess.length > 0)
    reply += `✅ Números reservados: ${reservedSuccess.join(', ')}\n`
  if (reservedFailed.length > 0)
    reply += `❌ Números indisponíveis: ${reservedFailed.join(', ')}`

  return SendMessageWithDelay({
    text: reply,
    jid: groupId,
    quoted: true,
    msg,
    sock,
  })
}

export { reserveNumbers }
