import { proto, WASocket } from '@whiskeysockets/baileys'
import { useBotStore } from '../../../../store/sock-store'
import { SendMessageWithDelay } from '../../../handlers/send-message-with-delay'
import { GetMessageFormatedNumber } from '../../../../utils/group/user/get-message-formated'
import { FindUser } from '../../../functions/group/find-user'

const RemoverUser = async (
  sock: WASocket,
  msg?: proto.IWebMessageInfo,
  args?: string[],
) => {
  const groupId = msg?.key.remoteJid

  if (!sock || !groupId) return

  const userID = await GetMessageFormatedNumber({ msg, args, sock })

  if (!userID || !args) {
    console.log('❌ Nenhum usuário informado')
    return
  }

  const participant = await FindUser({ msg, args, sock })
  if (!participant) return
  try {
    const result = await sock.groupParticipantsUpdate(
      groupId,
      [participant.id],
      'remove',
    )

    if (!result) return

    result.forEach(r => {
      switch (r.status) {
        case '200':
          console.log(`✅ Usuário ${r.jid} removido com sucesso`)
          break
        case '404':
          console.log(`⚠️ Usuário ${r.jid} já não estava no grupo`)
          break
        case '403':
          console.log(`🚫 Sem permissão para remover ${r.jid}`)
          break
        default:
          console.log(`❌ Falha ao remover ${r.jid}, status: ${r.status}`)
      }
    })

    return result
  } catch (err) {
    console.error('Erro ao remover usuário:', err)
  }
}

export { RemoverUser }
