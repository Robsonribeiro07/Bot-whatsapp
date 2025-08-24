import { Rifa } from '../models/Rifa'

const formatRifaMessageDisponivel = (rifa: Rifa): string => {
  let message = `🎟️ Bilhetes Disponivel \n *Rifa ID:* ${rifa.id}\n💰 *Valor:* R$${rifa.valor}\n🕒 *Horário:* ${rifa.horario}\n\n
    
    ${rifa.listaDisponiveis().join(',')}
    
    `

  message += '✨ Boa sorte a todos!\n'
  return message
}

export { formatRifaMessageDisponivel }
