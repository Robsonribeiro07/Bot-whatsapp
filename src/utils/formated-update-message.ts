import { Rifa } from '../models/Rifa'

const formatRifaMessageUpdate = (rifa: Rifa): string => {
  let message = `🎟️ Rifa Atualiada \n *Rifa ID:* ${rifa.id}\n💰 *Valor:* R$${rifa.valor}\n🕒 *Horário:* ${rifa.horario}\n\n`

  const bilhetes = rifa.Bilhetes
  const blockSize = 10 // quantidade de bilhetes por bloco

  for (let i = 0; i < bilhetes.length; i += blockSize) {
    const block = bilhetes.slice(i, i + blockSize)

    block.forEach(b => {
      if (b.ReservedBy && b.User) {
        message += `✅ Número ${b.Number}: ${b.User}\n`
      } else {
        message += `🔹 Número ${b.Number}: Disponível\n`
      }
    })

    message += '\n' // espaço entre blocos
  }

  message += '✨ Boa sorte a todos!\n'
  return message
}

export { formatRifaMessageUpdate }
