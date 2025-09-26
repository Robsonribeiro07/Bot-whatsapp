export function GetMessagetext(msg: any) {
  if ('conversation' in msg && msg.conversation) return msg.conversation
  if (
    'extendedTextMessage' in msg &&
    msg.extendedTextMessage.text === 'string'
  ) {
    return msg.extendedTextMessage.text
  }

  if (msg.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
    return msg.extendedTextMessage.contextInfo.quotedMessage.conversation
  }

  return ''
}
