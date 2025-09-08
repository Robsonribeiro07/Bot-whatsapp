import { userServiceFind } from '../../services/users/find-user'
import {
  Controller,
  Get,
  Query,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa'
import { UserDTO } from '../../routes/dtos/user-Dtos'

@Route('user')
@Tags('Users')
export class FindUserControoler extends Controller {
  @Get('get-user')
  @SuccessResponse('200', 'Usuario Encontrado com sucess')
  @Response('404', 'Usuario nao encontrado')
  public async findUser(@Query() jid: string): Promise<UserDTO | null> {
    const user = await userServiceFind({ id: jid })

    if (!user) {
      this.setStatus(404)
      return null
    }

    this.setStatus(200)

    return user
  }
}
