'use strict'

class AppUtility {

    bindDataToNotification(data: any, notification: any) {
        let title = notification.title
        let body = notification.body

        if (!data || !Object.keys(data).length) {
            return { title, body, image: notification.image }

        } else {
            const dataKeys = Object.keys(data)

            dataKeys.forEach(key => {
                const bindingKey = `{${key}}`
                if (title.indexOf(bindingKey) > -1) {
                    title = title.replace(bindingKey, data[key])
                }
                if (body.indexOf(bindingKey) > -1) {
                    body = body.replace(bindingKey, data[key])
                }
            })
    
            return { title, body, image: notification.image }
        }
    }

    invalid(obj: any) {

        if (!obj) {
            return { error: 'Undefine object' }
        }

        let invalid: boolean = false
        const error: any = {}
        const keys = Object.keys(obj)

        keys.forEach(key => {
            const v = obj[key]
            if (!v || !v.trim()) {
                error[key] = 'Invalid'
                invalid = true
            }
        })

        if (invalid) {
            return error
        } else {
            return false
        }
    }

    handleError(error: any) {
        console.log(error)
    }
}

const appUtility = new AppUtility()
export default appUtility
