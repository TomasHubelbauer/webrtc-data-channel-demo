const openOffererAnswererDemoButton = document.querySelector('#openOffererAnswererDemoButton');
const openPeerDemoButton = document.querySelector('#openPeerDemoButton');

openOffererAnswererDemoButton.addEventListener('click', () => window.open('offerer-answerer/index.html', '_blank', 'width=800,height=600'));
openPeerDemoButton.addEventListener('click', () => window.open('peer/index.html', '_blank', 'width=800,height=600'));
