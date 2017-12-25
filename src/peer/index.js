window.addEventListener('load', event => {
	// console.log('[index] loaded');
	const peers = [...document.querySelectorAll(`iframe[src^='peer.html#']`)].map(iframe => iframe.getAttribute('src').split('#')[1]); // CORS
	for (const peer of peers) {
		sendMessageToPeer({ type: 'index-hello', peer });
		sendMessageToPeer({ type: 'index-knock', peer, peers: peers.filter(p => p !== peer) })
	}
});

window.addEventListener('message', event => {
	receiveMessage(event.data);
});

function receiveMessage(data) {
	switch (data.type) {
		case 'peer-hello': {
			// console.log(`[index] peer ${data.name} says hello`);
			break;
		}

		case 'peer-offer':
		case 'peer-answer':
		case 'peer-candidate': {
			// console.groupCollapsed(`[index] marshalling from ${data.name} to ${data.peer}:`, data.type);
			// console.log(data);
			// console.groupEnd();
			sendMessageToPeer(data);
			break;
		}

		default: {
			console.error('[index] unprocessable message type', data.type, data);
		}
	}
}

function sendMessageToPeer(data) {
	document.querySelector(`iframe[src$='#${data.peer}']`).contentWindow.postMessage(data, '*');
	// console.groupCollapsed(`[index] sent message to peer ${data.peer}:`, data.type);
	// console.log(data);
	// console.groupEnd();
}
