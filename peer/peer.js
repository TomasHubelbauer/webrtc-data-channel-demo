const name = window.location.hash.substr(1);
let peerConnection;
let dataChannel;

window.addEventListener('load', event => {
	// console.log(`[peer ${name}] loaded`);
	document.getElementById('titleH1').textContent += ` (${name})`;
	sendMessageToIndex({ type: 'peer-hello', name });

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
	// console.groupCollapsed(`[peer ${name}] sent message to index:`, data.type);
	// console.log(data);
	// console.groupEnd();
}

async function receiveMessage(data) {
	switch (data.type) {
		case 'index-hello': {
			// console.log(`[peer ${name}] index says hello`);
			break;
		}

		case 'index-knock': {
			console.log(`[peer ${name}] index provides new peers`);
			for (const peer of data.peers) {
				const button = document.createElement('button');
				button.id = `connect${peer}Button`;
				button.textContent = `Connect to ${peer}`;
				button.addEventListener('click', async event => {
					await initializeAndSendOffer(peer);
					console.log(`[peer ${name}] initialized peer connection`);
				});

				const li = document.createElement('li');
				li.appendChild(button);
				
				document.getElementById('peerListUl').appendChild(li);
			}

			break;
		}

		case 'peer-offer': {
			console.log(`[peer ${name}] received peer offer from ${data.name}`);
			await initializeAndSendAnswer(data.offer, data.name);
			console.log(`[peer ${name}] initialized peer connection`);
			break;
		}

		case 'peer-answer': {
			console.log(`[peer ${name}] received peer answer from ${data.name}`);
			await peerConnection.setRemoteDescription(data.answer)
			console.log(`[peer ${name}] set peer description`);
			break;
		}

		case 'peer-candidate': {
			console.log(`[peer ${name}] received ice candidate from ${data.name}`);
			await peerConnection.addIceCandidate(data.candidate)
			console.log(`[peer ${name}] added peer ice candidate from ${data.name}`);
			break;
		}

		default: {
			console.error(`[peer ${name}] unprocessable message type`, data.type, data);
		}
	}
}

async function initializeAndSendOffer(peer) {
	peerConnection = new RTCPeerConnection({ iceServers: [ { urls: [ 'stun:stun.l.google.com:19302' ] } ] });

	peerConnection.onconnectionstatechange = event => console.log(`[peer ${name}] onconnectionstatechange`, event);

	peerConnection.ondatachannel = event => console.log(`[peer ${name}] ondatachannel`);

	peerConnection.onicecandidate = event => {
		// console.groupCollapsed(`[peer ${name}] onicecandidate`);
		// console.log(event.candidate);
		// console.groupEnd();
		if (event.candidate) {
			sendMessageToIndex({ type: 'peer-candidate', name, peer, candidate: JSON.parse(JSON.stringify(event.candidate)) });
		}
	};

	peerConnection.oniceconnectionstatechange = event => {
		console.log(`[peer ${name}] oniceconnectionstatechange`, peerConnection.iceConnectionState);
		document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	};

	peerConnection.onicegatheringstatechange = event => {
		console.log(`[peer ${name}] onicegatheringstatechange`, peerConnection.iceGatheringState);
		document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	};
	
	peerConnection.onidentityresult = event => console.log(`[peer ${name}] onidentityresult`, event);

	peerConnection.onidpassertionerror = event => console.log(`[peer ${name}] onidpassertionerror`, event);

	peerConnection.onidpvalidationerror = event => console.log(`[peer ${name}] onidpvalidationerror`, event);

	//peerConnection.onnegotiationneeded = event => console.log(`[peer ${name}] onnegotiationneeded`);

	peerConnection.onpeeridentity = event => console.log(`[peer ${name}] onpeeridentity`, event);

	peerConnection.onremovestream = event => console.log(`[peer ${name}] onremovestream`, event);

	peerConnection.onsignalingstatechange = event => {
		console.log(`[peer ${name}] onsignalingstatechange`, peerConnection.signalingState);
		document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
	};

	peerConnection.ontrack = event => console.log(`[peer ${name}] ontrack`, event);

	dataChannel = peerConnection.createDataChannel('test');

	dataChannel.onbufferedamountlow = event => console.log(`[peer ${name}] onbufferedamountlow`, event);

	dataChannel.onclose = event => console.log(`[peer ${name}] onclose`, event);

	dataChannel.onerror = event => console.log(`[peer ${name}] onerror`, event);

	dataChannel.onmessage = event => {
		const li = document.createElement('li');
		li.className = 'them';
		li.textContent = event.data;
		document.getElementById('messageLogUl').appendChild(li);
	};

	dataChannel.onopen = event => console.log(`[peer ${name}] onopen`);

	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);
	sendMessageToIndex({ type: 'peer-offer', name, peer, offer: { type: offer.type, sdp: offer.sdp } });
	
	document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
}

async function initializeAndSendAnswer(offer, peer) {
	peerConnection = new RTCPeerConnection({ iceServers: [ { urls: [ 'stun:stun.l.google.com:19302' ] } ] });

	peerConnection.onconnectionstatechange = event => console.log(`[peer ${name}] onconnectionstatechange`, event);

	peerConnection.ondatachannel = event => {
		console.log(`[peer ${name}] ondatachannel`);
		dataChannel = event.channel;

		dataChannel.onbufferedamountlow = event => console.log(`[peer ${name}] onbufferedamountlow`, event);

		dataChannel.onclose = event => console.log(`[peer ${name}] onclose`, event);

		dataChannel.onerror = event => console.log(`[peer ${name}] onerror`, event);

		dataChannel.onmessage = event => {
			const li = document.createElement('li');
			li.className = 'them';
			li.textContent = event.data;
			document.getElementById('messageLogUl').appendChild(li);
		};

		dataChannel.onopen = event => console.log(`[peer ${name}] onopen`);
	};

	peerConnection.onicecandidate = event => {
		// console.groupCollapsed(`[peer ${name}] onicecandidate`);
		// console.log(event.candidate);
		// console.groupEnd();
		if (event.candidate) {
			sendMessageToIndex({ type: 'peer-candidate', name, peer, candidate: JSON.parse(JSON.stringify(event.candidate)) });
		}
	};

	peerConnection.oniceconnectionstatechange = event => {
		console.log(`[peer ${name}] oniceconnectionstatechange`, peerConnection.iceConnectionState);
		document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	};

	peerConnection.onicegatheringstatechange = event => {
		console.log(`[peer ${name}] onicegatheringstatechange`, peerConnection.iceGatheringState);
		document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	};
	
	peerConnection.onidentityresult = event => console.log(`[peer ${name}] onidentityresult`, event);

	peerConnection.onidpassertionerror = event => console.log(`[peer ${name}] onidpassertionerror`, event);

	peerConnection.onidpvalidationerror = event => console.log(`[peer ${name}] onidpvalidationerror`, event);

	//peerConnection.onnegotiationneeded = event => console.log(`[peer ${name}] onnegotiationneeded`);

	peerConnection.onpeeridentity = event => console.log(`[peer ${name}] onpeeridentity`, event);

	peerConnection.onremovestream = event => console.log(`[peer ${name}] onremovestream`, event);

	peerConnection.onsignalingstatechange = event => {
		console.log(`[peer ${name}] onsignalingstatechange`, peerConnection.signalingState);
		document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
	};

	peerConnection.ontrack = event => console.log(`[peer ${name}] ontrack`, event);

	await peerConnection.setRemoteDescription(offer);
	console.log(`[peer ${name}] set offerer description`);
	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);
	sendMessageToIndex({ type: 'peer-answer', name, peer, answer: { type: answer.type, sdp: answer.sdp } });
	
	document.getElementById('iceConnectionStateSpan').textContent = peerConnection.iceConnectionState;
	document.getElementById('iceGatheringStateSpan').textContent = peerConnection.iceGatheringState;
	document.getElementById('signalingStateSpan').textContent = peerConnection.signalingState;
}
