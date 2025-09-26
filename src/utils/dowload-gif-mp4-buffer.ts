import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

/**
 * Baixa um GIF de uma URL e converte para MP4 (compatível com WhatsApp).
 */
export async function downloadGifAsMp4Buffer(gifUrl: string): Promise<Buffer> {
  const tempGif = join(tmpdir(), `temp-${Date.now()}.gif`)
  const tempMp4 = join(tmpdir(), `temp-${Date.now()}.mp4`)

  const response = await axios.get(gifUrl, { responseType: 'arraybuffer' })
  fs.writeFileSync(tempGif, response.data)

  await new Promise<void>((resolve, reject) => {
    ffmpeg(tempGif)
      .outputOptions([
        '-movflags faststart',
        '-pix_fmt yuv420p',
        '-vf scale=320:-2:flags=lanczos',
      ])
      .toFormat('mp4')
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .save(tempMp4)
  })

  const mp4Buffer = fs.readFileSync(tempMp4)

  fs.unlinkSync(tempGif)
  fs.unlinkSync(tempMp4)

  return mp4Buffer
}
