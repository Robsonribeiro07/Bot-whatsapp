import { Body, Controller, Post, Route, Tags } from 'tsoa'
import {
  IsendMessageUser,
  sendMessageUseService,
} from '../../services/whatsapp/send-message-user-service'

@Route('user/whatsapp')
@Tags('User')
export class WhatsappController extends Controller {
  @Post('send-message')
  public async sendMessage(@Body() body: IsendMessageUser): Promise<void> {
    const { message, userId, type, userToSendMessage } = body

    try {
      const response = await sendMessageUseService({
        message,
        userId,
        type,
        userToSendMessage,
      })

      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }
}
