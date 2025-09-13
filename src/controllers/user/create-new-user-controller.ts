// src/controllers/UserController.ts
import {
  Body,
  Controller,
  Post,
  Route,
  Tags,
  Response,
  SuccessResponse,
} from 'tsoa'
import {
  IUserSchemaServices,
  userServiceCreate,
} from '../../services/users/create-user'
import { connectBotController } from '../bot/connect-controller'
import { CreateUserDTO } from '../../routes/dtos/CreateUserDTO'
import { generateQrcode } from '../../utils/bot/generate-QRcode'
import { bots } from '../../database/bot/bot-manager'

interface ICreateUserResponse {
  message:
    | 'bot-connectado'
    | 'Usuario criado'
    | 'Erro ao criar usuário'
    | 'Houve um erro ao criar o bot'
    | 'Erro interno no servidor'
  user?: IUserSchemaServices
  QRcode?: string
  base64?: string
  statusBot?: boolean
}
@Route('user')
@Tags('Users')
export class UserController extends Controller {
  @Post('create')
  @SuccessResponse('200', 'Usuário criado com sucesso')
  @Response('500', 'Erro interno do servidor')
  public async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<ICreateUserResponse> {
    const { id } = body

    console.log(id)

    try {
      const User = await userServiceCreate({ id })

      console.log(User)
      if (!User) return { message: 'Erro ao criar usuário' }

      let qrCode

      const existingBot = bots[id]

      if (existingBot) {
        if (!existingBot.getStatus()) {
          await existingBot.regenerateQrcode()
          qrCode = await generateQrcode({ bot: existingBot })
        }
        this.setStatus(200)

        return {
          user: User,
          message: 'bot-connectado',
          statusBot: existingBot.getStatus(),
          QRcode: qrCode?.qr,
          base64: qrCode?.base64?.replace(/^data:image\/png;base64,/, ''),
        }
      }

      const bot = await connectBotController(id)

      if (!bot) return { message: 'Houve um erro ao criar o bot' }

      qrCode = await generateQrcode({ bot })

      this.setStatus(200)
      return {
        message: 'Usuario criado',
        user: User,
        statusBot: bot.getStatus(),
        QRcode: qrCode.qr,
        base64: qrCode?.base64?.replace(/^data:image\/png;base64,/, ''),
      }
    } catch (err) {
      console.error(err)
      this.setStatus(500)
      return { message: 'Erro interno no servidor' }
    }
  }
}
