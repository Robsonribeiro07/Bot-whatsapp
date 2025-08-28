import { WASocket } from '@whiskeysockets/baileys'
import { RafflesStorage } from '../../../database/raffle-storage'
import { useBotStore } from '../../../store/sock-store'
import { formatRifaMessageUpdate } from '../../../utils/formated-update-message'
import { SendMessageWithDelay } from '../../handlers/send-message-with-delay'

const updateRifas = async (sock: WASocket) => {
  const { groupId } = useBotStore.getState()

  const newUpdateRifas = RafflesStorage.find(r => r.id)

  if (!newUpdateRifas)
    return await SendMessageWithDelay({
      text: 'Houve um Erro ao Atualizar Rifa',
      jid: groupId,
      sock,
    })

  const RifasFormated = formatRifaMessageUpdate(newUpdateRifas)

  await SendMessageWithDelay({ text: RifasFormated, jid: groupId, sock })
}

export { updateRifas }
