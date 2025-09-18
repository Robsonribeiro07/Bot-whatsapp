import { dir } from 'console'
import { promises as fs } from 'fs'
import path from 'path'

interface ISycronizeAllData {
  data: any[]
  userId: string
}

interface ISycronizeAllDataResponse {
  code: 201 | 500
}

export async function SycronizeAllDataServices({
  data,
  userId,
}: ISycronizeAllData): Promise<ISycronizeAllDataResponse> {
  try {
    const dirPath = path.join(process.cwd(), 'src', 'config', 'gemini', 'data')

    await fs.mkdir(dirPath, { recursive: true })

    const filePath = path.join(dirPath, `${userId}.json`)

    const jsonData = JSON.stringify(data, null, 2)

    await fs.writeFile(filePath, jsonData, 'utf-8')

    console.log('Dados sincronizados para o usuário', userId)

    console.log(dirPath)

    return {
      code: 201,
    }
  } catch (err) {
    console.error(err)
    return {
      code: 500,
    }
  }
}
