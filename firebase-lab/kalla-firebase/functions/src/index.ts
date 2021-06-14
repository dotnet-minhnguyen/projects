'use strict'

import * as functions from 'firebase-functions';
import appConfig from './app.config'
import appService from './app.service'

appConfig.registryFirebaseAdmin()

exports.login = functions.https.onRequest(async (request: any, response: any) => {
    const rs = await appService.loginAsync(request.body)
    response.json(rs)
})

exports.send = functions.https.onRequest(async (request: any, response: any) => {
    const rs = await appService.sendAsync(request.body)
    response.json(rs)
})

exports.upsertEvent = functions.https.onRequest(async (request: any, response: any) => {
    const rs = appService.upsertEvent(request.body)
    response.json(rs)
})
