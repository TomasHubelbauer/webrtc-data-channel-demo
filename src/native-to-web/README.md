# Native to Web Mode

- Create new XCode Single View application called Mobile
- Install Carthage
- Install Telegraph (web server, web socket server) and WebRTC
- `carthage update --platform iOS`
- Drag framework files from Carthage/Builds to Embedded Frameworks section in XCode

## Native Offered Mode

- Start web socket server and let web app connect
- Prepare connection and send offer
- Wait for JavaScript to prepare connection and send answer

## Native Answerer Mode

- Start web socket server and let web app connect
- Wait for JavaScript to prepare connection and send offer
- Prepare connection and send answer
