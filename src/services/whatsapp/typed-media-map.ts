import { AnyMessageContent } from '@whiskeysockets/baileys'
import { downloadGifAsMp4Buffer } from '../../utils/dowload-gif-mp4-buffer'

export type MediaType = 'text' | 'image' | 'video' | 'gif'
type MediaBuilder = (url: string, extra?: any) => Promise<AnyMessageContent>

export const messageBuilder: Record<MediaType | 'text', MediaBuilder> = {
  image: async (url, extra) => ({ image: { url }, caption: extra?.caption }),
  video: async (url, extra) => ({ video: { url }, caption: extra?.caption }),
  text: async url => ({ text: url }),
  gif: async (url, extra) => ({
    gifPlayback: true,
    video: await downloadGifAsMp4Buffer(url),
    caption: 'seul lindogif',
    mimetype: 'video/mp4',
  }),
}
