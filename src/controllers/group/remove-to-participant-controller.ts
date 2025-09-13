import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa'
import { IRemoveParticipantToGroupDTO } from '../../routes/dtos/group/remove-to-participant'
import {
  IResponseRemoveParticipants,
  RemoveParticipantsTogGroupSerivces,
} from '../../services/group/remove-participant-service'

@Route('group')
@Tags('Group')
export class RemovoToParticipantController extends Controller {
  @Post('remove-participant')
  @SuccessResponse('200', 'Usuario removido com sucesso')
  @Response('500', 'erro interno')
  public async remoteToParticipantControoler(
    @Body() body: IRemoveParticipantToGroupDTO,
  ): Promise<IResponseRemoveParticipants> {
    const { userId, participantsToRemove, groupId } = body

    try {
      const response = await RemoveParticipantsTogGroupSerivces({
        userId,
        participantsToRemove,
        groupId,
      })

      if (response.code === 500) {
        this.setStatus(500)
        return {
          message: 'Houve um ero interno',
          code: response.code,
        }
      } else if (response.code === 404) {
        this.setStatus(404)
        return {
          message: response.message,
          code: response.code,
        }
      }

      this.setStatus(200)

      return {
        code: response.code,
        message: 'usuario removido com sucesso',
        userUpdated: response.userUpdated,
      }
    } catch (err) {
      console.log(err)
      this.setStatus(500)
      return {
        message: (err as Error).message,
        code: 500,
      }
    }
  }
}
