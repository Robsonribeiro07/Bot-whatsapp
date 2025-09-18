import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa'
import {
  IRegisterToken,
  IRegisterTokenResponse,
  registerTokenToUserService,
} from '../../services/users/register-token-notification'

@Route('token')
@Tags('Token')
export class registerTokenToPushNotificationController extends Controller {
  @Post('register')
  @SuccessResponse('200', 'Token Registrado com sucesso')
  public async registerToTokenPush(
    @Body() body: IRegisterToken,
  ): Promise<IRegisterTokenResponse> {
    const { userId, token } = body

    try {
      const response = await registerTokenToUserService({ userId, token })

      this.setStatus(response.code)

      console.log(response)
      return {
        message: response.message,
        code: response.code,
      }
    } catch (err) {
      this.setStatus(500)
      return {
        message: 'houve um erro interno',
        code: 500,
      }
    }
  }
}
