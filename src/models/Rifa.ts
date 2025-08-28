export interface Bilhete {
  Number: number
  User: string | null
  ReservedBy: boolean
}

export class Rifa {
  id: string
  valor: number
  horario: string
  Bilhetes: Bilhete[]
  messageId: string[]
  closed: boolean

  constructor(id: string, valor: number, horario: string) {
    this.id = id
    this.valor = valor
    this.horario = horario
    this.messageId = []
    this.closed = false

    this.Bilhetes = Array.from({ length: 100 }, (_, i) => ({
      Number: i + 1,
      User: null,
      ReservedBy: false,
    }))
  }

  reservedNumber(Number: number, User: string): boolean {
    const Bilhete = this.Bilhetes.find(b => b.Number === Number)

    if (!Bilhete) return false
    if (Bilhete.ReservedBy) return false

    Bilhete.User = User
    Bilhete.ReservedBy = true
    return true
  }

  listaDisponiveis(): number[] {
    return this.Bilhetes.filter(b => !b.ReservedBy).map(b => b.Number)
  }

  ListReserved(): Bilhete[] {
    return this.Bilhetes.filter(b => b.ReservedBy)
  }
}
