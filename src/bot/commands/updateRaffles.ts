import { RafflesStorage } from '../../database/Raffles'
import { useBotStore } from '../../store/sock-store'
import { formatRifaMessageUpdate } from '../../utils/formatted-upadet-rifa'
import { SendMessageWithDelay } from '../handlers/sendMessageWithDelay'

const updateRifas = async () => {
  const { groupId } = useBotStore.getState()

  const newUpdateRifas = RafflesStorage.find(r => r.id)

  if (!newUpdateRifas)
    return await SendMessageWithDelay({
      text: 'Houve um Erro ao Atualizar Rifa',
      jid: groupId,
    })

  const RifasFormated = formatRifaMessageUpdate(newUpdateRifas)

  await SendMessageWithDelay({ text: RifasFormated, jid: groupId })
}

export { updateRifas }
