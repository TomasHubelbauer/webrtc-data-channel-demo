window.addEventListener('load', event => {
	document.getElementById('openOffererAnswererDemoButton').addEventListener('click', event => {
		const demoWindow = window.open('offerer-answerer/index.html', '_blank', 'width=800,height=600');
	});

	document.getElementById('openPeerDemoButton').addEventListener('click', event => {
		const demoWindow = window.open('peer/index.html', '_blank', 'width=800,height=600');
	});
});
