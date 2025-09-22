import { IOnChunk } from '../../openIA/functions/stream'
import { UserAction } from '../../typed'
import { handlersByAction } from './handle-by-action'

interface IExecuteByAction {
  action: UserAction
  onChunk?: IOnChunk
  shouldStop?: () => boolean
}

export function executeAction({
  action,
  onChunk,
  shouldStop,
}: IExecuteByAction) {
  const handler = handlersByAction[action.action] as (
    a: typeof action,
    onChunk?: IOnChunk,
    shouldStop?: () => boolean,
  ) => void

  if (!handler) return
  handler(action, onChunk, shouldStop)
}
