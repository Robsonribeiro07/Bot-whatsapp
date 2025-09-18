import { GoogleGenAI } from '@google/genai'
import { ai } from '../../../config/gemini'
import path from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { RaffleData, UserHistory } from './typed-raffle-manager'
import { processeMessage } from '../../../config/gemini/functions/Raffle/processMessage'

export class RaffleManage {
  private rafflesPath: string
  private raffles: RaffleData
  private history: UserHistory = {}
  private ai: GoogleGenAI = ai

  constructor() {
    this.rafflesPath = path.join(__dirname, 'Raffles', 'global.json')
    this.raffles = this.loadRaffles()
    this.createAuthPath()
  }

  private createAuthPath() {
    if (!existsSync(this.rafflesPath)) {
      mkdirSync(this.rafflesPath, { recursive: true })
    }
  }

  private loadRaffles(): RaffleData {
    const dir = path.dirname(this.rafflesPath)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    if (
      !existsSync(this.rafflesPath) ||
      readFileSync(this.rafflesPath, 'utf-8').trim() === ''
    ) {
      writeFileSync(this.rafflesPath, JSON.stringify([], null, 2))
      return []
    }

    return JSON.parse(readFileSync(this.rafflesPath, 'utf-8'))
  }

  private saveRaffeles() {
    writeFileSync(this.rafflesPath, JSON.stringify(this.raffles, null, 2))
  }

  private addUserMessage(userId: string, msg: string) {
    if (!this.history[userId]) this.history[userId] = []

    this.history[userId].push(msg)

    if (this.history[userId].length > 10) {
      this.history[userId].shift()
    }
  }
  public processeMessageFn = async (message: string, userId: string) => {
    this.addUserMessage(userId, message)
    const response = await processeMessage({
      historyMessage: this.history,
      message,
      raffles: this.raffles,
      userId,
    })

    if (response?.rifas) {
      this.saveRaffeles()
    }

    return {
      response,
    }
  }
}
