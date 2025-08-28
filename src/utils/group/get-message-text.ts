import { proto } from '@whiskeysockets/baileys'

const GetMessageText = (msg: proto.IWebMessageInfo) => {
  return msg.message?.conversation || msg.message?.extendedTextMessage?.text
}

export default GetMessageText
