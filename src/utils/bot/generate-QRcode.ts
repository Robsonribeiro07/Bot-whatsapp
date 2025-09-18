import { BotManager } from '../../bot/manager/bot-manager'
import { IRegenareteQRcodeResponseService } from '../../services/users/regenarete-qr-code'

interface IGenerateQRcode {
  bot: BotManager
}
export async function generateQrcode({ bot }: IGenerateQRcode) {
  return new Promise<IRegenareteQRcodeResponseService>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Qr code timeout')),
      10000,
    )

    bot.once('qrcode', (data: { qr: string; base64: string }) => {
      clearTimeout(timeout)
      resolve(data)
    })
  })
}
