import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa'
import {
  IPromoteGroup,
  IPromoteGroupResponse,
  PromoteGroupSerivces,
} from '../../services/group/promote-to-admin-service'

@Route('group')
@Tags('Groups')
export class PromoteToAdminController extends Controller {
  @Post('promote-to-group')
  @SuccessResponse('200', 'Usuario promovido com sucesso')
  @Response('404', 'Usuario nao encontrado')
  @Response('403', 'todos os campos sao obrigatorios')
  public async promoteToAdmin(
    @Body() body: IPromoteGroup,
  ): Promise<IPromoteGroupResponse> {
    const { groupId, participantId, userId, promote } = body

    console.log(groupId, participantId, userId, promote)

    try {
      const response = await PromoteGroupSerivces({
        userId,
        groupId,
        participantId,
        promote,
      })

      if (response.code === 500) {
        this.setStatus(500)

        return {
          message: response.message,
          code: response.code,
        }
      }

      if (response.code === 404) {
        this.setStatus(404)
        return {
          message: response.message,
          code: response.code,
        }
      }

      this.setStatus(200)

      return {
        message: response.message,
        code: response.code,
      }
    } catch (err) {
      this.setStatus(500)
      return {
        message: (err as Error).message,
        code: 500,
      }
    }
  }
}
