type RaffleItem = {
  hour: Date
  value: string
  id: string

  number: {
    owner: string
    available: boolean
  }[]
}

export const exemplaRaffle: RaffleItem = {
  hour: new Date(),
  value: '50',
  id: 'rafle-12kf-25',
  number: [
    { owner: '557582598725@s.whatsapp.net', available: false },
    { owner: '', available: true },
  ],
}

// monta

export type RaffleData = RaffleItem[]

export type UserHistory = {
  [userId: string]: string[]
}
