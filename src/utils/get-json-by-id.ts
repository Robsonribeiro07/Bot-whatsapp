import { json } from 'body-parser'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

export async function getJsonById(id: string) {
  const dirPath = path.join(
    process.cwd(),
    'src',
    'config',
    'gemini',
    'data',
    `${id}.json`,
  )

  if (!existsSync(dirPath)) {
    writeFileSync(dirPath, JSON.stringify([]))
  }
  const fileContent = readFileSync(dirPath, 'utf-8')

  return JSON.parse(fileContent)
}
