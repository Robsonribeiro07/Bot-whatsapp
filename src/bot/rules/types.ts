import { WASocket } from '@whiskeysockets/baileys'

export type Permission =
  | 'ALL_PERMISSIONS'
  | 'BAN_USER'
  | 'CLOSE_GROUP'
  | 'OPEN_GROUP'
  | 'UPDATE TICKETS'

export interface PermissionOptins {
  sock: WASocket
  remoteJid: string
  userId: string
  required: Permission
  participationID: string
}
