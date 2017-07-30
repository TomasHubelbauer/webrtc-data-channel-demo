# WebRTC Data Channels Example
A simple example of WebRTC Data Channels. Uses [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) as a substitute for a real signalling channel.

![A screenshot of Google Chrome running the example](screenshot.png)

I've made this because I was frustrated with the lack of good WebRTC data channel examples and tutorials online. Either they went out of date really quickly or they were written in an order that made it confusing and hard to follow for me when thinking about the actual order of events happening during the connection establishment process.

The code should be self-explanatory when following MDN on the side. There is only one gotcha and it is documented/commented. Following the Console messages in Developer Tools should clear what happens and when. Additional commented-out `console.log`s can be uncommented to shed even more light on the order of events.

This example is written using latest JavaScript features available in Chrome 59. It does not use anything else and runs off the `file` protocol.

## Running
`open index.html`

## Contributing
Please review the code-base and do not hesitate to open an issue or a PR with questions or proposed changes. PRs in the spirit of this excercise will be merged, PRs adding fluff that has no direct impact on understanding the data channels flow (like adding alternative signalling channel mechanism which work the same way the current one does, adding bundlers etc.) will be respectfully declined.

One example of a good contribution would be splitting the repo into two directories - one with explicit offerer-answerer roles and one with a single *peer* role where the peer is able to both initiate and accept a connection.

I will work on that when time allows.

[I have asked for a code review of this example on Stack Exchange Code Review](https://codereview.stackexchange.com/q/171282/87918)
