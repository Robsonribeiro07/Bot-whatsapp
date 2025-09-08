import { bots } from '../../database/bot/bot-manager'
import { generateQrcode } from '../../utils/bot/generate-QRcode'

export interface IRegenareteQRcodeService {
  id: string
}

export interface IRegenareteQRcodeResponseService {
  qr?: any
  base64?: string
}
export async function RegenerateQRCodeService({
  id,
}: IRegenareteQRcodeService): Promise<IRegenareteQRcodeResponseService | null> {
  if (!id) return null

  try {
    const bot = bots[id]

    await bot.regenerateQrcode()

    const QRCodeData = await generateQrcode({ bot: bot })

    return {
      qr: QRCodeData.qr,
      base64: QRCodeData.base64,
    }
  } catch (err) {
    return null
  }
}
