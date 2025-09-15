import { UserModel } from '../../database/mongoDB/user-schema'

export interface IRegisterToken {
  userId: string
  token: string
}

export interface IRegisterTokenResponse {
  code: 200 | 500 | 404
  message: string
}

export async function registerTokenToUserService({
  userId,
  token,
}: IRegisterToken): Promise<IRegisterTokenResponse> {
  if (!userId || !token) {
    return { code: 500, message: 'userId or token is missing' }
  }

  try {
    await UserModel.findOneAndUpdate(
      { id: userId },
      { $addToSet: { pushTokens: token } },
      { upsert: true, new: true },
    )

    return { code: 200, message: 'Token registered successfully' }
  } catch (err) {
    console.error('Error registering token:', err)
    return { code: 500, message: 'Failed to register token' }
  }
}
