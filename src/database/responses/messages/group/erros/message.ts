export interface IMessages {
  ExistingUser: string
}

const MessageErros: Record<keyof IMessages, string> = {
  ExistingUser: 'Usuario ja esta nesse grupo',
}

export { MessageErros }
