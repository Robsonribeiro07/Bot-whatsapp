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
  IRegenareteQRcodeResponseService,
  IRegenareteQRcodeService,
} from '../../services/users/regenarete-qr-code'
import { bots } from '../../database/bot/bot-manager'
import { generateQrcode } from '../../utils/bot/generate-QRcode'

interface IRegenerateQRCodeResponse extends IRegenareteQRcodeResponseService {
  message?: string
  error?: string
}

@Route('bot')
@Tags('Bot')
export class Regenarate extends Controller {
  /**
   * Gera um novo Qrocde para o bot
   */
  @Post('regenerate/qrcode')
  @SuccessResponse('200', 'QR code gerado com sucesso')
  @Response('403', 'Id necessario')
  @Response('405', 'Bot nao encontrado')
  @Response('500', 'Houve um erro ao gerar Um novo Qrcode')
  public async regenaretaQRcode(
    @Body() body: IRegenareteQRcodeService,
  ): Promise<IRegenerateQRCodeResponse> {
    const { id } = body

    try {
      const bot = bots[id]

      if (!bot) {
        this.setStatus(405)

        return {
          message: 'Houve um error ao  encontrar bot',
        }
      }

      await bot.regenerateQrcode()

      const QRcodedata = await generateQrcode({ bot })

      console.log(QRcodedata)

      if (!QRcodedata) {
        this.setStatus(500)

        return {
          message: 'Houve um Erro ao gerar o novo qr code',
          error: 'Error ao criar um novo Qrcode, tente novamente',
        }
      }

      this.setStatus(200)

      return {
        qr: QRcodedata.qr,
        base64: QRcodedata.base64,
        message: 'QR code gerado com sucesso',
      }
    } catch (err) {
      this.setStatus(500)
      return {
        error: (err as Error).message,
      }
    }
  }
}
