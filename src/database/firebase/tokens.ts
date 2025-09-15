interface IToken {
  token: string[]
}

interface IAddToken {
  newToken: string
  userId: string
}
export const tokens: Record<string, IToken> = {}

export function AddToken({ userId, newToken }: IAddToken) {
  if (!tokens[userId]) {
    tokens[userId] = { token: [newToken] }

    return true
  } else {
    if (!tokens[userId].token.includes(newToken)) {
      tokens[userId].token.push(newToken)
      return true
    }
  }

  return false
}
