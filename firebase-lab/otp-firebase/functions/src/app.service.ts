
'use strict'

import * as admin from 'firebase-admin'
import appUtility from './app.utility'
import twilioConfig from './twilio.config'

const DATABASE = {
    users: '/users'
}

class AppService {

    async registerPhone({ phone }: any) {
        const invalid = appUtility.invalid({ phone })
        if (invalid) {
            return invalid
        }

        const uid = appUtility.getUidFromPhone(phone)
        return admin.auth().createUser({ uid })
    }

    async requestOTP({ phone }: any) {
        const invalid = appUtility.invalid({ phone })
        if (invalid) {
            return invalid
        }

        const uid = appUtility.getUidFromPhone(phone)
        console.log(uid, 'phone number')

        return admin.auth().getUser(uid)
            .then(userRecord => {
                const otp = appUtility.getOTPCode()

                return twilioConfig.client.messages.create({
                    body: 'Your code is ' + otp,
                    to: uid,
                    from: twilioConfig.TWILIO_NUMBER,
                }, (err: any) => {
                    if (err) throw { error: err }

                    return admin.database().ref(`${DATABASE.users}/${uid}`)
                        .update({ code: otp, codeValid: true }, () => {
                            return { success: true }
                        })
                })
            })
            .catch((err) => {
                throw { error: err }
            })

    }

    async verifyOTP({ phone, code }: any) {
        const invalid = appUtility.invalid({ phone, code })
        if (invalid) {
            throw { error: 'Phone and code must be provided!' }
        }

        const uid = appUtility.getUidFromPhone(phone)
        const otp = parseInt(code)

        return admin.auth().getUser(uid)
            .then(() => {
                const ref = admin.database().ref(`${DATABASE.users}/${uid}`)

                ref.on('value', snapshot => {
                    ref.off()
                    const user = snapshot.val()

                    if (user.code !== otp || !user.codeValid) {
                        return { error: 'Invalid code!!' }
                    }

                    ref.update({ codeValid: false })

                    return admin.auth().createCustomToken(uid)
                        .then(token => { token })
                        .catch(error => { error })
                })
            })
            .catch((err) => {
                throw { error: err }
            })
    }
}

const appService = new AppService()
export default appService
