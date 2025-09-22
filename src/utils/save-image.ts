import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import {
  downloadMediaMessage,
  MediaType,
  proto,
  WAMessage,
} from '@whiskeysockets/baileys'

export async function SaveMediaWhatsapp(
  msg: WAMessage,
  userId: string | undefined,
  type: MediaType,
  deleteAfterMs = 5 * 60 * 1000,
): Promise<string> {
  if (!userId) return ''
  const buffer = await downloadMediaMessage(msg, 'buffer', {})
  const userDir = path.join(process.cwd(), 'src', 'uploads', userId)

  if (!existsSync(userDir)) {
    mkdirSync(userDir, { recursive: true })
  }

  const extension = type === 'image' ? 'jpg' : 'mp4'
  const name = `${type}-${Date.now()}.${extension}`
  const filePath = path.join(userDir, name)

  writeFileSync(filePath, buffer)

  setTimeout(() => {
    if (existsSync(filePath)) unlinkSync(filePath)
  }, deleteAfterMs)

  const server = 'http://10.0.0.106:3000'

  return `${server}/uploads/${userId}/${name}`
}
