import { proto, WASocket } from '@whiskeysockets/baileys'
import { useStore } from 'zustand'
import { useBotStore } from '../../../../store/sock-store'
import { GetGroupMetada } from '../../../../utils/group/get-group-metada'
import { GetMessageFormatedNumber } from '../../../../utils/group/user/get-message-formated'
import { FindUser } from '../../../functions/group/find-user'
import { FormatNumber } from '../../../../utils/group/user/format-numbers'
import { SendMessageWithDelay } from '../../../handlers/send-message-with-delay'
import { SendResponseGroup } from '../../../../database/responses/messages/group'

const AddUser = async (
  sock: WASocket,
  msg?: proto.IWebMessageInfo,
  args?: string[],
) => {
  if (!msg?.key.remoteJid || !args || !sock) return

  const groupId = msg.key.remoteJid

  const UserId = await GetMessageFormatedNumber({ msg, args, sock })

  const checksIfDoesNotExistUser = await FindUser({ msg, args, sock })

  if (checksIfDoesNotExistUser) {
    return await SendResponseGroup({
      message: 'ExistingUser',
      typeMessage: 'Erros',
      msg,
      personalizedMessage: `user ${checksIfDoesNotExistUser.name}`,
      sock,
    })
  }
  if ((checksIfDoesNotExistUser && !groupId) || !UserId) return

  try {
    const result = await sock.groupParticipantsUpdate(
      groupId,
      [FormatNumber({ FullNumber: true, input: UserId!.result })],
      'add',
    )
    if (!result) return

    result.forEach(r => {
      switch (r.status) {
        case '200':
          break
      }
    })
    return SendResponseGroup({
      typeMessage: 'Sucess',
      message: 'SucessAddUserGroup',
      msg,
      sock,
    })
  } catch (err) {
    console.log(err)
    await SendMessageWithDelay({
      jid: groupId,
      text: 'Por favor verique o numero e tente novamente',
      sock,
    })
  }
}

export { AddUser }
