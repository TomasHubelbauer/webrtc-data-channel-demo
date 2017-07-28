window.addEventListener('load', event => {
	//console.log('[offerer] loaded');
	sendMessageToIndex({ type: 'offerer-hello' });

	document.getElementById('messageInput').addEventListener('keydown', event => {
		if (event.key === "Enter") {
			const message = event.currentTarget.value;
			event.currentTarget.value = '';

			const li = document.createElement('li');
			li.className = 'me';
			li.textContent = message;
			document.getElementById('messageLogUl').appendChild(li);

			dataChannel2.send(message);
		}
	});
});

window.addEventListener('message', event => {
	receiveMessage(event.data);
});

function sendMessageToIndex(data) {
	window.parent.postMessage(data, '*');
	//console.groupCollapsed('[offerer] sent message to index:', data.type);
	//console.log(data);
	//console.groupEnd();
}

let peerConnection;
let dataChannel2;

function receiveMessage(data) {
	switch (event.data.type) {
		case 'index-hello': {
			//console.log('[offerer] index says hello');
			peerConnection = initializeAndSendOffer();
			break;
		}

		case 'answerer-answer': {
			console.log('[offerer] received answerer answer');
			peerConnection.setRemoteDescription(event.data.answer)
				.then(() => console.log('[offerer] set answerer description'))
				.catch(console.error);
			break;
		}

		case 'answerer-candidate': {
			console.log('[offerer] received answerer candidate');
			peerConnection.addIceCandidate(event.data.candidate)
				.then(() => console.log('[offerer] added answerer ice candidate'))
				.catch(console.error);
			break;
		}

		default: {
			console.error('[offerer] unprocessable message type', event.data.type, event.data);
		}
	}
}

function initializeAndSendOffer() {
	const peerConnection = new RTCPeerConnection({ iceServers: [ { urls: [ 'stun:stun.l.google.com:19302' ] } ] });

	peerConnection.onaddstream = event => console.log('[offerer] onaddstream', event);

	peerConnection.onconnectionstatechange = event => console.log('[offerer] onconnectionstatechange', event);

	peerConnection.ondatachannel = event => console.log('[offerer] ondatachannel');

	peerConnection.onicecandidate = event => {
		//console.groupCollapsed('[offerer] onicecandidate');
		//console.log(event.candidate);
		//console.groupEnd();
		if (event.candidate) {
			sendMessageToIndex({ type: 'offerer-candidate', candidate: JSON.parse(JSON.stringify(event.candidate)) });
		}
	};

	peerConnection.oniceconnectionstatechange = event => {
		console.log('[offerer] oniceconnectionstatechange', peerConnection.iceConnectionState);
		document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	};

	peerConnection.onicegatheringstatechange = event => {
		console.log('[offerer] onicegatheringstatechange', peerConnection.iceGatheringState);
		document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	};
	
	peerConnection.onidentityresult = event => console.log('[offerer] onidentityresult', event);

	peerConnection.onidpassertionerror = event => console.log('[offerer] onidpassertionerror', event);

	peerConnection.onidpvalidationerror = event => console.log('[offerer] onidpvalidationerror', event);

	//peerConnection.onnegotiationneeded = event => console.log('[offerer] onnegotiationneeded');

	peerConnection.onpeeridentity = event => console.log('[offerer] onpeeridentity', event);

	peerConnection.onremovestream = event => console.log('[offerer] onremovestream', event);

	peerConnection.onsignalingstatechange = event => {
		console.log('[offerer] onsignalingstatechange', peerConnection.signalingState);
		document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
	};

	peerConnection.ontrack = event => console.log('[offerer] ontrack', event);

	const dataChannel = peerConnection.createDataChannel('test');

	dataChannel.onbufferedamountlow = event => console.log('[offerer] onbufferedamountlow', event);

	dataChannel.onclose = event => console.log('[offerer] onclose', event);

	dataChannel.onerror = event => console.log('[offerer] onerror', event);

	dataChannel.onmessage = event => {
		const li = document.createElement('li');
		li.className = 'them';
		li.textContent = event.data;
		document.getElementById('messageLogUl').appendChild(li);
	};

	dataChannel.onopen = event => console.log('[offerer] onopen');

	dataChannel2 = dataChannel;

	peerConnection.createOffer()
		.then(offer => {
			peerConnection.setLocalDescription(offer);
			sendMessageToIndex({ type: 'offerer-offer', offer: { type: offer.type, sdp: offer.sdp } });
		})
		.catch(console.error);
	
	document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
	return peerConnection;
}
