'use strict'

import { DATABASES } from './app.type'
import appUtility from './app.utility'
import fcmMessaging from './firebase.messaging'
import fireDatabase from './firebase.database'

const topic_notification_key = 'topic_notification'
const token_notification_key = 'token_notification'

class AppService {

    async loginAsync({ user_id, device_id, notification_token }: any) {
        const invalid = appUtility.invalid({ user_id, device_id, notification_token })
        if (invalid) {
            return invalid
        }

        const user = await fireDatabase.registryAsync(device_id, notification_token, user_id)
        return user
    }

    upsertEvent({ client_id, app_event_type, topic_notification, token_notification }: any) {
        const invalid = appUtility.invalid({ app_event_type })
        if (invalid) {
            return invalid
        }

        const event: any = {}
        const client_events_db = `/${client_id}/${DATABASES.events}`

        if (topic_notification) {
            event[topic_notification_key] = topic_notification
            fireDatabase.upsert(client_events_db, app_event_type, event)

        } else {
            fireDatabase.remove(`${client_events_db}/${app_event_type}`, topic_notification_key)
        }

        if (token_notification) {
            event[token_notification_key] = token_notification
            fireDatabase.upsert(client_events_db, app_event_type, event)

        } else {
            fireDatabase.remove(`${client_events_db}/${app_event_type}`, token_notification_key)
        }

        return event
    }

    async sendAsync({ client_id, app_event_type, topic, users, data }: any) {
        const invalid = appUtility.invalid({ app_event_type })
        if (invalid) {
            return invalid
        }

        const event: any = await this._getEventAsync(client_id, app_event_type)
        let sendSuccess = false

        if (topic && event.topic_notification) {
            const client_topic = topic //client_id + topic

            if (client_topic) {
                const topic_notification = appUtility.bindDataToNotification(data, event.topic_notification)
                fcmMessaging.sendToTopic(topic_notification, client_topic)
                event.topic_notification = topic_notification
                sendSuccess = true
            }
        }

        if (users.length && event.token_notification) {
            const tokens: any[] = await this._getTokensAsync(users)

            if (tokens && tokens.length) {
                const token_notification = appUtility.bindDataToNotification(data, event.token_notification)
                fcmMessaging.sendMulticast(token_notification, tokens)
                event.token_notification = token_notification
                sendSuccess = true
            }
        }

        if (sendSuccess) {
            fireDatabase.newMessage(DATABASES.messages, app_event_type, {event, users, topic})
        }

        return {event, users, topic}
    }


    private async _getTokensAsync(users_ids: any[]) {
        const tokens: any[] = []

        for (const user_id of users_ids) {

            await fireDatabase.get(DATABASES.users, user_id, (snapshot: any) => {
                const obj = snapshot.val()

                if (obj) {
                    const devices_ids = Object.keys(obj)
                    for (const device_id of devices_ids) {
                        const token = obj[device_id]
                        tokens.push(token)
                    }
                }
            })
        }

        return tokens
    }

    private async _getEventAsync(client_id: any, app_event_type: any) {
        const client_events_db = `/${client_id}/${DATABASES.events}`
        let event = {}

        await fireDatabase.get(client_events_db, app_event_type, (snapshot: any) => {
            event = snapshot.val()
        })

        return event
    }

}

const appService = new AppService()
export default appService
