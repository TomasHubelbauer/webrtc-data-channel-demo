window.addEventListener('load', event => {
	//console.log('[index] loaded');
	sendMessageToOfferer({ type: 'index-hello' });
	sendMessageToAnswerer({ type: 'index-hello' });
});

window.addEventListener('message', function (event) {
	receiveMessage(event.data);
});

function receiveMessage(data) {
	switch (data.type) {
		case 'offerer-hello': {
			//console.log('[index] offerer says hello');
			break;
		}
		case 'answerer-hello': {
			//console.log('[index] answerer says hello');
			break;
		}

		case 'offerer-offer':
		case 'offerer-candidate': {
			//console.groupCollapsed('[index] marshalling between offerer and answerer:', data.type);
			//console.log(data);
			//console.groupEnd();
			sendMessageToAnswerer(data);
			break;
		}

		case 'answerer-answer':
		case 'answerer-candidate': {
			//console.groupCollapsed('[index] marshalling between answerer and offerer:', data.type);
			//console.log(data);
			//console.groupEnd();
			sendMessageToOfferer(data);
			break;
		}

		default: {
			console.error('[index] unprocessable message type', data.type, data);
		}
	}
}

function sendMessageToOfferer(data) {
	document.getElementById('offererFrame').contentWindow.postMessage(data, '*');
	//console.groupCollapsed('[index] sent message to offerer:', data.type);
	//console.log(data);
	//console.groupEnd();
}

function sendMessageToAnswerer(data) {
	document.getElementById('answererFrame').contentWindow.postMessage(data, '*');
	//console.groupCollapsed('[index] sent message to answerer:', data.type);
	//console.log(data);
	//console.groupEnd();
}
