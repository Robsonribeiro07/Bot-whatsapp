export interface ActionParams {
  id?: string // ID do usuário no WhatsApp (@whatsapp)
  name?: string // Nome do usuário
  role?: string // Cargo do usuário
  promote?: 'add' | 'remove' | 'promote' | 'demote' | 'modify'
  message: IMessageContent
  groupId: string // ID do grupo
  userId: string // ID do usuário alvo
  socketId: string // Socket do usuário
}

export type IMessaType = 'text' | 'img'

export type IMessageContent = {
  type: IMessaType
  message: string
}

export type GroupActionType = 'promote'

export type IAction = 'TEXT' | 'ACTION_GROUP' | 'USER_MESSAGE'

export interface GroupActionItem {
  type: GroupActionType
  params: ActionParams
}

export interface GroupActions {
  userId: string
  socketId: string
  groupId: string
  participants: GroupActionItem[]
}

export type UserAction =
  | {
      action: 'TEXT'
      content: IMessageContent
    }
  | {
      action: 'ACTION_GROUP'
      content: IMessageContent
      groupActions: GroupActions[]
    }
  | {
      action: 'USER_MESSAGE'

      response: IMessageContent
      content: {
        type: 'text'
        message: string
        userId: string
      }
      userMessages: {
        message: string
        userToSendMessage: string
        type: IMessaType
      }[]
    }
