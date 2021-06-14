'use strict'

export const DATABASES = {
    devices: '/devices',
    events: 'events', // need the prefix for client as working with multi tenancy
    users: '/users',
    messages: '/messages',
}

export const APP_MESSAGE_SCHEME = {
    message: {
        notification: { title: 'Price drop', body: '5% off all electronics' },
        android: {
            notification: {
                sound: 'default',
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                },
            },
        },
        // token: ''
        // or tokens: []
        // or topic: ''
    }
}

export const APP_TOPIC_TYPE = {
    ADMIN: 'ADMIN',
    TECHNICIAN: 'TECHNICIAN',
    CUSTOMER: 'CUSTOMER',
}

export const APP_EVENT_TYPE = {
    APPOINTMENT_ASSIGN: 'APPOINTMENT_ASSIGN',
    APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
    APPOINTMENT_DONE: 'APPOINTMENT_DONE',
    APPOINTMENT_RE_ASSIGN: 'APPOINTMENT_RE_ASSIGN',
    APPOINTMENT_REMIND: 'APPOINTMENT_REMIND',
    APPOINTMENT_REQUEST: 'APPOINTMENT_REQUEST',
    CUSTOMER_CHECK_IN: 'CUSTOMER_CHECK_IN',
    LEAVE_APPROVED: 'LEAVE_APPROVED',
    LEAVE_REQUEST: 'LEAVE_REQUEST',
    SEND_DEAL: 'SEND_DEAL',
    WELCOME_CUSTOMER: 'WELCOME_CUSTOMER',
}

