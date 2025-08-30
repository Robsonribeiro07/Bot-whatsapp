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
import { userServiceCreate } from '../../services/users/create-user'
import { connectBotController } from '../bot/connect-controller'
import { CreateUserDTO } from '../../routes/dtos/CreateUserDTO'
import { userServiceFind } from '../../services/users/find-user'
import { transformToGroupSchemas } from '../../utils/schema/transformToGroupSchema'

interface ICreateUserResponse {
  message: string
  user?: unknown
}

@Route('user')
@Tags('Users')
export class UserController extends Controller {
  /**
   * Cria um novo usuário
   */
  @Post('create')
  @SuccessResponse('200', 'Usuário criado com sucesso')
  @Response('403', 'Usuário já existe')
  @Response('500', 'Erro interno do servidor')
  public async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<ICreateUserResponse> {
    const { name, number, id } = body

    console.log(body)
    try {
      const user = await userServiceCreate({
        id,
        name,
        number,
      })

      if (!user) {
        this.setStatus(500)
        return { message: 'Erro ao criar usuário' }
      }

      await connectBotController(user._id)

      this.setStatus(200)
      return { message: 'Usuário criado com sucesso', user }
    } catch (err) {
      console.error(err)
      this.setStatus(500)
      return { message: 'Erro interno do servidor' }
    }
  }
}
