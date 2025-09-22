import { MediaType, WAMessage } from '@whiskeysockets/baileys'
import { SaveMediaWhatsapp } from '../../../../utils/save-image'

type ImediaMap = {
  type: MediaType | 'text'
  save?: (m: WAMessage, jid: string, type: MediaType) => Promise<string>
}

export const mediaMap: Record<string, ImediaMap> = {
  conversation: {
    type: 'text',
  },
  imageMessage: {
    type: 'image',
    save: SaveMediaWhatsapp,
  },
  documentMessage: {
    type: 'image',
    save: SaveMediaWhatsapp,
  },
  videoMessage: {
    type: 'video',
    save: SaveMediaWhatsapp,
  },
}
