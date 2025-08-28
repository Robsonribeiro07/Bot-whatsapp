export interface IMessagesSucess {
  SucessAddUserGroup: string
}

const MessageSucess: Record<keyof IMessagesSucess, string> = {
  SucessAddUserGroup: 'Usuario Adicionado com sucesso',
}

export { MessageSucess }
