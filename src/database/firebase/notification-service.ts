import admin from './firebase.admin'

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  try {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
    }

    const response = await admin.messaging().send(message)
    console.log('Mensagem enviada com sucesso:', response)
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
  }
}
