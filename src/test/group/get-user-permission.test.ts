import { permission } from 'process'
import { getUserPermissionsService } from '../../services/group/get-user-permission'
import { findParticipantGroupService } from '../../services/group/find-participant-service'

jest.mock('../../services/group/find-participant-service')

describe('getUserPermissionService', () => {
  it('deve retorna todas as permissoes se for admin', async () => {
    ;(findParticipantGroupService as jest.Mock).mockResolvedValue({
      id: '557583250140@s.whatsapp.net',
      admin: 'admin',
      name: 'Robson',
      profilePic: null,
      rules: ['BAN_USER'],
    })
    const perms = await getUserPermissionsService({
      userID: '68b0c05320a2dbbf8089d162',
      remoteJid: '120363420435813452',
      participantID: '557583250140@s.whatsapp.net',
    })

    expect(perms).toBeDefined()
    expect(perms).toContain('ALL_PERMISSIONS')
  })
})
