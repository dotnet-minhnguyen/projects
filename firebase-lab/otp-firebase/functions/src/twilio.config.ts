import * as twilio from 'twilio'

class TwilioConfig {
    ACCOUNT_SID='AC0acad4c52374e3a9b6ec2f49fbc3e4a4'
    AUTH_TOKEN='e63d6c3f768bbd9a36358e3624113558'
    TWILIO_NUMBER='+14076412276'//'+19842091196'
    RECOVERY_CODE='x3PXziFEV1AfSL-u-3_4Xx_u8H4OWSqg0MzlVV3V'
    client: any

    registryTwilio() {
        this.client = new twilio.Twilio(this.ACCOUNT_SID, this.AUTH_TOKEN)
    }
}

const twilioConfig = new TwilioConfig()
export default twilioConfig
