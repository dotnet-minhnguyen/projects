import '@twilio-labs/serverless-runtime-types'

import {
    Context,
    ServerlessCallback,
    ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'

// You have to change that based on which parameters you expect to be passed to
// your Twilio Function via the POST body or request parameters.
type RequestParameters = {};

export const handler: ServerlessFunctionSignature = function (
    context: Context,
    event: RequestParameters,
    callback: ServerlessCallback
) {
    const twiml = new Twilio.twiml.MessagingResponse();
    twiml.message('Hello World from TypeScript!');
    callback(null, twiml)
}
