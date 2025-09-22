import { PromoteGroupSerivces } from '../../../services/group/promote-to-admin-service'
import { sendMessageUseService } from '../../../services/whatsapp/send-message-user'
import { IOnChunk, StreamIA } from '../../openIA/functions/stream'
import { ActionParams, GroupActionType, UserAction } from '../../typed'
const handlersByGroupAction: Record<
  GroupActionType,
  (params: ActionParams) => Promise<void>
> = {
  promote: async params => {
    const { groupId, promote = 'promote', socketId, id, userId } = params

    const result = await PromoteGroupSerivces({
      groupId,
      promote,
      userId,
      participantId: [id!],
    })
    console.log(result)
  },
}

export const handlersByAction = {
  TEXT: (
    action: Extract<UserAction, { action: 'TEXT' }>,
    onChunk?: IOnChunk,
    shouldStop?: () => boolean,
  ) => {
    StreamIA({ content: action.content, shouldStop, onChunk })
  },
  ACTION_GROUP: async (
    action: Extract<UserAction, { action: 'ACTION_GROUP' }>,
    onChunk?: IOnChunk,
    shouldStop?: () => boolean,
  ) => {
    for (const actions of action.groupActions) {
      for (const actionsgroup of actions.participants) {
        StreamIA({
          content: actionsgroup.params.message,
          shouldStop,
          onChunk,
        })

        await handlersByGroupAction[actionsgroup.type]({
          ...actionsgroup.params,
          groupId: actions.groupId,
          userId: actions.userId,
          socketId: actions.socketId,
        })
      }
    }
  },
  USER_MESSAGE: async (
    action: Extract<UserAction, { action: 'USER_MESSAGE' }>,
    onChunk?: IOnChunk,
    shouldStop?: () => boolean,
  ) => {
    StreamIA({
      content: action.response,
      onChunk,
      shouldStop,
    })

    console.log(action)
    for (const messages of action.userMessages) {
      await sendMessageUseService({
        message: messages.message,
        userId: action.content.userId,
        userToSendMessage: messages.userToSendMessage,
        type: messages.type,
      })
    }
  },
}
