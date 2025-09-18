import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa'
import { SycronizeAllDataServices } from '../../services/users/sycronize-all-data'

@Route('user')
@Tags('User')
export class SycronizeAllDataController extends Controller {
  @Post('sycronize-all-data')
  @SuccessResponse('201', 'Dados alterado com sucesso')
  public async SycronizeAllData(@Body() body: { data: any[]; userId: string }) {
    const { data, userId } = body

    try {
      const response = await SycronizeAllDataServices({ data, userId })

      if (response.code) {
        this.setStatus(response.code)
      }
    } catch (err) {
      this.setStatus(500)
      console.log(err)
    }
  }
}
