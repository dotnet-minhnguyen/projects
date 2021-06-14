'use strict'

import { DATABASES } from './app.type'
import * as admin from 'firebase-admin'
import appUtility from './app.utility'

class FireDatabase {

	async registryAsync(device_id: any, notification_token: any, user_id: any) {

		await this.get(DATABASES.devices, device_id, (snapshot: any) => {
			const userId = snapshot.val()
			// Remove old user:device
			this.remove(`${DATABASES.users}/${userId}`, device_id)
		})

		const device: any = {}
		device[device_id] = user_id
		this.upsertWithoutChildRef(DATABASES.devices, device)

		const user: any = {}
		user[device_id] = notification_token
		this.upsert(DATABASES.users, user_id, user)

		return user
	}

	upsert(uri: any, child_ref: any, child: any) {
		const childRef = admin.database().ref(uri).child(child_ref)
		childRef.update(child)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}

	upsertWithoutChildRef(uri: any, child: any) {
		const childRef = admin.database().ref(uri)
		childRef.update(child)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}

	remove(uri: any, child_ref: any) {
		const childRef = admin.database().ref(uri).child(child_ref)
		childRef.remove()
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}

	get(uri: any, child_ref: any, callback: any) {
		const childRef = admin.database().ref(uri).child(child_ref)
			.once("value", (snapshot) => callback(snapshot))
		return childRef
	}

	getWithoutChildRef(uri: any, callback: any) {
		const childRef = admin.database().ref(uri)
			.once("value", (snapshot) => callback(snapshot))
		return childRef
	}

	newMessage(uri: any, ref: any, child: any) {
		const time = ref + Date.now() + new Date().toDateString()
		const childRef = admin.database().ref(uri).child(time)
		childRef.update(child)
			.catch(err => appUtility.handleError(err))
			.then(() => console.log('this will succeed'))
			.catch(() => 'obligatory catch')
	}
}

const fireDatabase = new FireDatabase()
export default fireDatabase

// Required for message: client_id, topic

//  DATABASE STRUCTURE:
// 	Case 1: Test user login to multiple device
// 	Case 2: Test multiple user to one device
// 	Case 3: Test client/topic
//	Case 4: Test multi client with case 1 and case 2

// const client_id = {
// 	events: {
// 		app_event_type: [
// 			{type: 'topic', notification: { title: '', body: ''}},
//			{type: 'token', notification: { title: '', body: ''}},
// 		],
// 	}
// }
// 	users: {
// 		user_id: { // query to userid and send all token
// 			device_id: notification_token
// 		}
// 	},
// 	devices: {
// 		device_id: user_id // one device for one user
// 	},
