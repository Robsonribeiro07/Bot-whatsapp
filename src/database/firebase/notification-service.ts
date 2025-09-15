import admin from './firebase.admin'

interface ISendNotificationPush {
  token: string
  title: string
  body: string
}
export async function sendPushNotification({
  token,
  title,
  body,
}: ISendNotificationPush) {
  const message = {
    notification: { title, body },
    token,
  }

  try {
    const response = admin.messaging().send(message)
    console.log('Notificaçao enviada', response)
  } catch (error) {
    console.error('erro  ao enviar notificaçao', error)
  }
}
