import * as functions from 'firebase-functions'
import appConfig from './app.config'
import twilioConfig from './twilio.config'
import appService from './app.service'

appConfig.registryFirebaseAdmin()
twilioConfig.registryTwilio()

exports.registerPhone = functions.https.onRequest(async (request: any, response: any) => {
    const rs = appService.registerPhone(request.body)
    response.json(rs)
})

exports.requestOTP = functions.https.onRequest(async (request: any, response: any) => {
    const rs = appService.requestOTP(request.body)
    response.json(rs)
})

exports.verifyOTP = functions.https.onRequest(async (request: any, response: any) => {
    const rs = appService.verifyOTP(request.body)
    response.json(rs)
})
