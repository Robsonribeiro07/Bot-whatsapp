import {
  exemplaRaffle,
  RaffleData,
  UserHistory,
} from '../../../../bot/manager/raffle/typed-raffle-manager'
import { parseJsonFromAI } from '../../../../utils/parserJsonFromIA'

import { ai } from '../../../gemini'

const systemPrompt = `
Você é um assistente de rifas para um grupo de WhatsApp. Regras:
- Recebe mensagens de usuários e identifica quando querem reservar/consultar números.
- cada mensagem deve ser independente de cada usario, so responsa o usuario com base nas mesnagem que foi enviada  com msm nome
- Sempre responda com um objeto JSON (apenas JSON) seguindo o schema:
- Cada Rifa tem que ter um id, unico voce deve retorna nesse formato ${JSON.stringify(exemplaRaffle, null, 2)}

{
  "reply": "mensagem amigável para enviar ao usuário",
  "action": "reserve" | "deny" | "info" | "none",
  "numero": (numero inteiro opcional),
  "rifas": [ mantendo esse exemplo ${JSON.stringify(exemplaRaffle, null, 2)} { "number": number, "ocupado": boolean, "owner"?: "userId" } ]
}

- Se o usuário pede reserva e o número está livre, action = "reserve" e devolva rifas com that number marcado ocupado e owner = userId.
- Se o número já estiver ocupado, action = "deny".
- Se a mensagem é apenas para ver os disponíveis, action = "info" e devolva rifas.
- Se não for intenção ligada à rifa, action = "none" e reply curta.
- quanto alguem pergunta  os numero disponiveis voce deve retorna os numeros disponivel da rifa


- Não coloque texto fora do JSON.
- Use o valor exato userId quando for setar dono.
- Rifa atual (JSON) abaixo:
`

interface IProcesseMessage {
  userId: string
  message: string
  historyMessage: UserHistory
  raffles: RaffleData
}

interface IProcesseMessageResponse {
  reply: string
  action: 'reserve' | 'deny' | 'info' | 'none'
  numero?: number
  rifas?: RaffleData
  id: string
}

export async function processeMessage({
  userId,
  message,
  raffles,
  historyMessage,
}: IProcesseMessage): Promise<IProcesseMessageResponse | null> {
  if (!userId || !message) return null

  try {
    const contents = [
      {
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n${JSON.stringify(raffles, null, 2)}` },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: `Histórico do usuário ${userId}: ${JSON.stringify(historyMessage[userId] || [])}\nMensagem atual: ${message}`,
          },
        ],
      },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    })

    const candidate = response.candidates?.[0]?.content?.parts?.[0]?.text
    if (!candidate) return null

    try {
      const parsed: IProcesseMessageResponse = parseJsonFromAI(candidate)
      return parsed
    } catch (err) {
      console.error('Erro ao interpretar JSON da IA:', err)
      return null
    }
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err)
    return null
  }
}
