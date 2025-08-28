import { hasPermission } from '../../bot/rules/permission-check'
import { GetGroupMetada } from '../../utils/group/get-group-metada'
import { findParticipantGroupService } from '../../services/group/find-participant-service'
import { WASocket } from '@whiskeysockets/baileys'
import { IsWhatasappAdmin } from '../../bot/rules/group-rules'

jest.mock('../../utils/group/get-group-metada')
jest.mock('../../services/group/find-participant-service')

const mockGroupMetada = {
  participants: [
    {
      id: '557583250140@s.whatsapp.net',
      admin: 'admin',
      name: 'Robson',
      profilePic: null,
      rules: ['BAN_USER', 'CLOSE_GROUP'],
    },
  ],
}
const mockParticipant = {
  id: '557583250140@s.whatsapp.net',
  admin: '12',
  name: 'Robson',
  profilePic: null,
  rules: ['BAN_USER'],
}
describe('hasPermisson', () => {
  const mockSock = {} as WASocket

  it('Deve retorna as permisson, se o usuario for um admin', async () => {
    ;(GetGroupMetada as jest.Mock).mockResolvedValue(mockGroupMetada)

    const hasPerms = await hasPermission({
      opts: {
        participationID: '557583250140@s.whatsapp.net',
        remoteJid: '2321',
        sock: mockSock,
        required: 'BAN_USER',
        userId: '2321',
      },
    })

    expect(hasPerms).toBe(true)
  })

  it('Deve retorna o usuario tem alguma custom rules especifica', async () => {
    ;(GetGroupMetada as jest.Mock).mockResolvedValue({
      participants: [
        {
          id: '557583250140@s.whatsapp.net',
          admin: 'admin',
          name: 'Robson',
          profilePic: null,
          rules: ['BAN_USER', 'CLOSE_GROUP'],
        },
      ],
    })
    ;(findParticipantGroupService as jest.Mock).mockResolvedValue(
      mockParticipant,
    )

    const hasPerms = await hasPermission({
      opts: {
        participationID: '557583250140@s.whatsapp.net',
        remoteJid: '2321',
        sock: mockSock,
        required: 'BAN_USER',
        userId: '2321',
      },
    })

    expect(hasPerms).toBe(true)
  })
})
