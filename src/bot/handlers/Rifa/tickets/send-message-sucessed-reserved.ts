import { proto } from '@whiskeysockets/baileys'
import { useBotStore } from '../../../../store/sock-store'

interface ISendMessageSucessedReserved {
  msg?: proto.IWebMessageInfo
  groupId: string
}
export async function SendMessageSucessedReserved({
  groupId,
  msg,
}: ISendMessageSucessedReserved) {
  const { sock } = useBotStore.getState()
  return await sock?.sendMessage(groupId, {
    react: {
      text: '✅',
      key: msg?.key,
    },
  })
}
