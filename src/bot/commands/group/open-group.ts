import { useBotStore } from '../../../store/sock-store'

const OpenGroup = async () => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock) return

  await sock?.groupSettingUpdate(groupId, 'not_announcement')
}

export { OpenGroup }
