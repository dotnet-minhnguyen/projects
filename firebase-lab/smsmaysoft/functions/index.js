"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("@twilio-labs/serverless-runtime-types");
exports.handler = function (context, event, callback) {
    var twiml = new Twilio.twiml.MessagingResponse();
    twiml.message('Hello World from TypeScript!');
    callback(null, twiml);
};
