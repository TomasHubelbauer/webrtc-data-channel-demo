# WebRTC Data Channels Example
A simple example of WebRTC Data Channels. Uses [postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) as a substitute for a real signalling channel.

I've made this because I was frustrated with the lack of good WebRTC data channel examples and tutorials online. Either they went out of date really quickly or they were written in an order that made it confusing and hard to follow for me when thinking about the actual order of events happening during the connection establishment process.

The code should be self-explanatory when following MDN on the side. There is only one gotcha and it is documented/commented. Following the Console messages in Developer Tools should clear what happens and when. Additional commented-out `console.log`s can be uncommented to shed even more light on the order of events.

This example is written using latest JavaScript features available in Chrome 59. It does not use anything else and runs off the `file` protocol.

## Running
`open index.html`

![A screenshot of Google Chrome running the example](screenshot.png)
