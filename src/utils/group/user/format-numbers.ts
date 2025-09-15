interface IFormatNumber {
  FullNumber?: boolean
  input: string
}
const FormatNumber = ({ FullNumber = false, input }: IFormatNumber) => {
  return FullNumber ? `55${input}@s.whatsapp.net` : `55${input}`
}

export { FormatNumber }
