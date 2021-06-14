'use strict'

import * as admin from 'firebase-admin'
import * as TYPE from './app.type'
import appUtility from './app.utility'

class FCMMessaging {

	sendToTopic(notification: any, topic: any) {
		const { message }: any = TYPE.APP_MESSAGE_SCHEME
		message.notification = notification
		message.topic = topic

		admin.messaging().send(message)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}

	sendMulticast(notification: any, tokens: any) {
		const { message }: any = TYPE.APP_MESSAGE_SCHEME
		message.notification = notification
		message.tokens = tokens

		admin.messaging().sendMulticast(message)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}

	sendAll(messages: any) {
		admin.messaging().sendAll(messages)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}
}

const fcmMessaging = new FCMMessaging()
export default fcmMessaging
