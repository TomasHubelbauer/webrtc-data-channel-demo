let peerConnection;
let dataChannel;

window.addEventListener('load', event => {
	//console.log('[answerer] loaded');
	sendMessageToIndex({ type: 'answerer-hello' });

	document.getElementById('messageInput').addEventListener('keydown', event => {
		if (event.key === "Enter") {
			const message = event.currentTarget.value;
			event.currentTarget.value = '';

			const li = document.createElement('li');
			li.className = 'me';
			li.textContent = message;
			document.getElementById('messageLogUl').appendChild(li);

			dataChannel.send(message);
		}
	});
});

window.addEventListener('message', event => {
	receiveMessage(event.data);
});

function sendMessageToIndex(data) {
	window.parent.postMessage(data, '*');
	//console.groupCollapsed('[answerer] sent message to index:', data.type);
	//console.log(data);
	//console.groupEnd();
}

async function receiveMessage(data) {
	switch (data.type) {
		case 'index-hello': {
			//console.log('[answerer] index says hello');
			break;
		}

		case 'offerer-offer': {
			console.log('[answerer] received offerer offer');
			await initializeAndSendAnswer(data.offer);
			console.log('[answerer] initialized peer connection');
			break;
		}

		case 'offerer-candidate': {
			console.log('[answerer] received offerer candidate');
			await peerConnection.addIceCandidate(data.candidate)
			console.log('[answerer] added offerer ice candidate');
			break;
		}

		default: {
			console.error('[answerer] unprocessable message type', data.type, data);
		}
	}
}

async function initializeAndSendAnswer(offer) {
	peerConnection = new RTCPeerConnection({ iceServers: [ { urls: [ 'stun:stun.l.google.com:19302' ] } ] });

	peerConnection.onconnectionstatechange = event => console.log('[answerer] onconnectionstatechange', event);

	peerConnection.ondatachannel = event => {
		console.log('[answerer] ondatachannel');
		dataChannel = event.channel;

		dataChannel.onbufferedamountlow = event => console.log('[offerer] onbufferedamountlow', event);

		dataChannel.onclose = event => console.log('[offerer] onclose', event);

		dataChannel.onerror = event => console.log('[offerer] onerror', event);

		dataChannel.onmessage = event => {
			const li = document.createElement('li');
			li.className = 'them';
			li.textContent = event.data;
			document.getElementById('messageLogUl').appendChild(li);
		};

		dataChannel.onopen = event => console.log('[answerer] onopen');
	};

	peerConnection.onicecandidate = event => {
		//console.groupCollapsed('[answerer] onicecandidate');
		//console.log(event.candidate);
		//console.groupEnd();
		if (event.candidate) {
			sendMessageToIndex({ type: 'answerer-candidate', candidate: JSON.parse(JSON.stringify(event.candidate)) });
		}
	};

	peerConnection.oniceconnectionstatechange = event => {
		console.log('[answerer] oniceconnectionstatechange', peerConnection.iceConnectionState);
		document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	};

	peerConnection.onicegatheringstatechange = event => {
		console.log('[answerer] onicegatheringstatechange', peerConnection.iceGatheringState);
		document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	};
	
	peerConnection.onidentityresult = event => console.log('[answerer] onidentityresult', event);

	peerConnection.onidpassertionerror = event => console.log('[answerer] onidpassertionerror', event);

	peerConnection.onidpvalidationerror = event => console.log('[answerer] onidpvalidationerror', event);

	//peerConnection.onnegotiationneeded = event => console.log('[answerer] onnegotiationneeded');

	peerConnection.onpeeridentity = event => console.log('[answerer] onpeeridentity', event);

	peerConnection.onremovestream = event => console.log('[answerer] onremovestream', event);

	peerConnection.onsignalingstatechange = event => {
		console.log('[answerer] onsignalingstatechange', peerConnection.signalingState);
		document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
	};

	peerConnection.ontrack = event => console.log('[answerer] ontrack', event);

	await peerConnection.setRemoteDescription(offer);
	console.log('[answerer] set offerer description');
	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);
	sendMessageToIndex({ type: 'answerer-answer', answer: { type: answer.type, sdp: answer.sdp } });
	
	document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
}
