import { useBotStore } from '../../../store/sock-store'

const closeGroup = async () => {
  const { sock, groupId } = useBotStore.getState()

  if (!sock) return

  await sock?.groupSettingUpdate(groupId, 'announcement')
}

export { closeGroup }
