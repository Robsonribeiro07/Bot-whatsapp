import { proto, WAMessage, WASocket } from '@whiskeysockets/baileys'

export type ICallBacksNames = 'reply' | 'read' | 'readOnly'

export type IcallBacksFunctions = (msg: WAMessage, sock: WASocket) => void

export interface ICallBacksOptions {
  groupId: string
  callBack: IcallBacksFunctions
}

export const callBackMap: Record<ICallBacksNames, IcallBacksFunctions> = {
  reply: (msg: WAMessage) => {
    console.log('reply callback', msg)
  },
  read: (msg: WAMessage) => {
    console.log('read callback', msg)
  },
  readOnly: (msg: WAMessage) => {
    console.log('readOnly callback', msg)
  },
}
