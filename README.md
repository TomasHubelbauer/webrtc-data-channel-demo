# WebRTC Data Channels Example

A simple example of WebRTC Data Channels.
Uses [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) as a substitute for a real signalling channel.

I've made this because I was frustrated with the lack of good WebRTC data channel examples and tutorials online.

The code should be self-explanatory when following MDN on the side. There is only one gotcha and it is documented/commented. Following the Console messages in Developer Tools should make it clear what happens and when.

## Offerer-answerer mode

Unix: `open offerer-answerer/index.html`

Windows: `start offerer-answerer/index.html`

In this demo, there are two separate files for offerer and answerer so that who does what when establishing a connection is clearly separated.

![A screenshot of Google Chrome running the example](offerer-answerer/screenshot.png)

```txt
offerer.js:39 [offerer] initialized peer connection
offerer.js:102 [offerer] onsignalingstatechange have-local-offer
offerer.js:85 [offerer] onicegatheringstatechange gathering
answerer.js:42 [answerer] received offerer offer
answerer.js:125 [answerer] set offerer description
answerer.js:118 [answerer] onsignalingstatechange have-remote-offer
answerer.js:49 [answerer] received offerer candidate
answerer.js:51 [answerer] added offerer ice candidate
answerer.js:118 [answerer] onsignalingstatechange stable
answerer.js:96 [answerer] oniceconnectionstatechange checking
answerer.js:44 [answerer] initialized peer connection
answerer.js:101 [answerer] onicegatheringstatechange gathering
offerer.js:44 [offerer] received answerer answer
offerer.js:102 [offerer] onsignalingstatechange stable
offerer.js:80 [offerer] oniceconnectionstatechange checking
offerer.js:46 [offerer] set answerer description
offerer.js:51 [offerer] received answerer candidate
offerer.js:53 [offerer] added answerer ice candidate
answerer.js:101 [answerer] onicegatheringstatechange complete
offerer.js:85 [offerer] onicegatheringstatechange complete
offerer.js:80 [offerer] oniceconnectionstatechange connected
offerer.js:80 [offerer] oniceconnectionstatechange completed
offerer.js:123 [offerer] onopen
answerer.js:96 [answerer] oniceconnectionstatechange connected
answerer.js:67 [answerer] ondatachannel
answerer.js:83 [answerer] onopen
```

## Peer mode

Unix: `open peer/index.html`

Windows: `start peer/index.html`

In this demo, each peer is capable of being either and offerer or an answerer. The flows for both are intertwined. Less clear but more real-life.

![A screenshot of Google Chrome running the example](peer/screenshot.png)

```txt
peer.js:44 [peer A1] index provides new peers
peer.js:44 [peer A2] index provides new peers
peer.js:44 [peer B1] index provides new peers
peer.js:44 [peer B2] index provides new peers
peer.js:128 [peer A1] onsignalingstatechange have-local-offer
peer.js:50 [peer A1] initialized peer connection
peer.js:111 [peer A1] onicegatheringstatechange gathering
peer.js:63 [peer B2] received peer offer from A1
peer.js:224 [peer B2] set offerer description
peer.js:217 [peer B2] onsignalingstatechange have-remote-offer
peer.js:77 [peer B2] received ice candidate from A1
peer.js:65 [peer B2] initialized peer connection
peer.js:79 [peer B2] added peer ice candidate from A1
peer.js:217 [peer B2] onsignalingstatechange stable
peer.js:195 [peer B2] oniceconnectionstatechange checking
peer.js:200 [peer B2] onicegatheringstatechange gathering
peer.js:70 [peer A1] received peer answer from B2
peer.js:128 [peer A1] onsignalingstatechange stable
peer.js:106 [peer A1] oniceconnectionstatechange checking
peer.js:77 [peer A1] received ice candidate from B2
peer.js:72 [peer A1] set peer description
peer.js:79 [peer A1] added peer ice candidate from B2
peer.js:200 [peer B2] onicegatheringstatechange complete
peer.js:111 [peer A1] onicegatheringstatechange complete
peer.js:106 [peer A1] oniceconnectionstatechange connected
peer.js:106 [peer A1] oniceconnectionstatechange completed
peer.js:149 [peer A1] onopen
peer.js:195 [peer B2] oniceconnectionstatechange connected
peer.js:166 [peer B2] ondatachannel
peer.js:182 [peer B2] onopen
peer.js:128 [peer B1] onsignalingstatechange have-local-offer
peer.js:50 [peer B1] initialized peer connection
peer.js:111 [peer B1] onicegatheringstatechange gathering
peer.js:63 [peer A2] received peer offer from B1
peer.js:77 [peer A2] received ice candidate from B1
peer.js:224 [peer A2] set offerer description
peer.js:79 [peer A2] added peer ice candidate from B1
peer.js:217 [peer A2] onsignalingstatechange have-remote-offer
peer.js:217 [peer A2] onsignalingstatechange stable
peer.js:195 [peer A2] oniceconnectionstatechange checking
peer.js:65 [peer A2] initialized peer connection
peer.js:200 [peer A2] onicegatheringstatechange gathering
peer.js:70 [peer B1] received peer answer from A2
peer.js:128 [peer B1] onsignalingstatechange stable
peer.js:106 [peer B1] oniceconnectionstatechange checking
peer.js:72 [peer B1] set peer description
peer.js:77 [peer B1] received ice candidate from A2
peer.js:79 [peer B1] added peer ice candidate from A2
peer.js:200 [peer A2] onicegatheringstatechange complete
peer.js:111 [peer B1] onicegatheringstatechange complete
peer.js:106 [peer B1] oniceconnectionstatechange connected
peer.js:106 [peer B1] oniceconnectionstatechange completed
peer.js:149 [peer B1] onopen
peer.js:195 [peer A2] oniceconnectionstatechange connected
peer.js:166 [peer A2] ondatachannel
peer.js:182 [peer A2] onopen
```

## Support

This example is written using latest JavaScript features available in:

- Chrome 63+
- Firefox 58+

It does not use anything else and runs off the `file` protocol.

## Exploring

See [doc/notes.md](doc/notes.md).

## Contributing

Please review the code-base and do not hesitate to open an issue or a PR with questions or proposed changes. PRs in the spirit of this excercise will be merged, PRs adding fluff that has no direct impact on understanding the data channels flow (like adding alternative signalling channel mechanism which work the same way the current one does, adding bundlers etc.) will be respectfully declined.

Suggested contributions:

See [doc/tasks.md](doc/tasks.md).
