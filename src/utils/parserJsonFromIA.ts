export function parseJsonFromAI(input: { text: string } | string): any | null {
  const raw = typeof input === 'string' ? input : input.text

  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Erro ao interpretar JSON da IA:', err)
    console.log('Texto da IA:', cleaned)
    return null
  }
}
