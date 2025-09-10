import { WASocket } from '@whiskeysockets/baileys'
import { GetUserDatFn } from './user/get-user-data'
import { Socket } from 'socket.io'

interface IBotUtils {
  sock?: WASocket
  socket?: Socket
  status?: boolean
  isUloadingDataRemote: boolean
}
export class BotUtils {
  private sock?: WASocket
  private socket?: Socket
  private status?: boolean
  private isUloadingDataRemote: boolean

  constructor({ sock, socket, status, isUloadingDataRemote }: IBotUtils) {
    this.sock = sock
    this.status = status
    this.isUloadingDataRemote = isUloadingDataRemote
    this.socket = socket
  }

  public async GetUserData() {
    if (!this.sock || !this.socket || !this.status) return
    return GetUserDatFn({
      isUloadingDataRemote: this.isUloadingDataRemote,
      sock: this.sock,
      socket: this.socket,
      status: this.status,
    })
  }

  public updateSock(sock: WASocket) {
    this.sock = sock
  }
  public updateSocket(socket: Socket) {
    this.socket = socket
  }
  public updateStatus(status: boolean) {
    this.status = status
  }
}
