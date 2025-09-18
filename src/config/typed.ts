interface ActionParams {
  id?: string // ID do WhatsApp (@whatsapp)
  name?: string // Nome do usuário
  role?: string // Cargo do usuário
  promote?: 'promote' | 'demote' | null
  message: string // Mensagem contextual
}

export type IAction = 'add' | 'remove' | 'text'

export interface UserAction {
  action: IAction
  content: string
  params: ActionParams | null
}
