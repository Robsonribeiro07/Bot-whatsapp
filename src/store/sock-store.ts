import { WASocket } from '@whiskeysockets/baileys'
import { createStore } from 'zustand/vanilla'

interface BotStore {
  sock: WASocket | null
  setSock: (sock: WASocket) => void
  groupId: string
}

export const useBotStore = createStore<BotStore>((set) => ({
  sock: null,
  groupId: '120363420435813452@g.us',
  setSock: (sock) => set({ sock }),
}))
