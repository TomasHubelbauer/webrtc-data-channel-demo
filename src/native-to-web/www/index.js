window.addEventListener('load', async _ => {
    try {
        const url = new URL(window.location.href);
        url.protocol = 'ws:';

        const webSocket = new WebSocket(url);

        webSocket.addEventListener('open', _ => {
            audit('web socket open', 'offerer');
            webSocket.send('TODO: Offer');
        });

        webSocket.addEventListener('message', _ => audit('web socket message', 'offerer'));

        webSocket.addEventListener('data', _ => audit('web socket data', 'offerer'));

        webSocket.addEventListener('close', _ => audit('web socket close', 'offerer'));

    } catch (error) {
        audit(error.message, 'offerer');
    }
});

function audit(message, source) {
    const auditUl = document.getElementById('auditUl');
    const auditLi = document.createElement('li');
    auditLi.textContent = source + ':' + message;
    auditUl.insertAdjacentElement('afterbegin', auditLi);
}
