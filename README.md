# Twilio-voice-call-example

twilio voice call with browser

Resource: https://www.twilio.com/blog/make-receive-phone-calls-browser-twilio-programmable-voice-python-javascript

# Setup Guide:

## Resources

- [Twiml for Voice](https://www.twilio.com/docs/voice/twiml)
- [Js SDK 2.0](https://www.twilio.com/docs/voice/sdks/javascript)
- [Handling no answer/ voicemail](https://www.twilio.com/blog/handle-no-answer-scenarios-voicemail-callback)

## Setting up Phone number and Twilio console configs

- Create a `Twiml App`:

  Voice url in `Twiml App` will be triggered when we client makes a call. In short `Twiml app` is responsible for handling outgoing calls

- Buy a Number capable of voice call
- Configure Bought Number configurations

  Voice configuration inside of Number configuration is used when that number receives a incoming call. The Urls linked with in Number Configuration will be triggered when it receives incoming call. (This can be done either by twilio api or through twilio console.)
