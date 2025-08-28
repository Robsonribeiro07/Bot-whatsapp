import { GroupParticipant, proto, WASocket } from '@whiskeysockets/baileys'
import { GetGroupMetada } from '../../../utils/group/get-group-metada'
import { GetMessageFormatedNumber } from '../../../utils/group/user/get-message-formated'

interface IFindUser {
  msg: proto.IWebMessageInfo
  args: string[]
  sock: WASocket
}

const FindUser = async ({
  msg,
  args,
  sock,
}: IFindUser): Promise<GroupParticipant | null> => {
  if (!msg || !args) return null

  const groupMetadata = await GetGroupMetada({ msg })
  if (!groupMetadata) return null

  const userID = await GetMessageFormatedNumber({ msg, args, sock })
  if (!userID) {
    console.log('❌ Nenhum usuário informado')
    return null
  }

  const userIdFormatted = `55${userID.result}`

  const participant = groupMetadata.participants.find(p =>
    p.id.startsWith(userIdFormatted),
  )

  return participant || null
}

export { FindUser }
