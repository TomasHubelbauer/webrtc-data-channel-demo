import UIKit
import WebKit
import Telegraph
import WebRTC

class ViewController: UIViewController {
    var webView: WKWebView!
    let server = Server()
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        server.serveDirectory(Bundle.main.url(forResource: "www", withExtension: nil)!, "/")
        server.webSocketDelegate = self
        do {
            try server.start(onPort: 8000)
            // TODO: Add open in Safari button but figure out how to keep the server alive when in background
            webView.load(URLRequest(url: URL(string: "http://localhost:8000")!))
        } catch {
            print(error)
        }
    }

    func audit(_ message: String) {
        // Telegraph delegate on background thread
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript("audit('\(message)', 'answerer')", completionHandler: nil)
        }
    }
}

extension ViewController: ServerWebSocketDelegate {
    func server(_ server: Server, webSocketDidConnect webSocket: WebSocket, handshake: HTTPRequest) {
        audit("web socket did connect")
    }
    
    func server(_ server: Server, webSocketDidDisconnect webSocket: WebSocket, error: Error?) {
        audit("web socket did disconnect")
    }
    
    func server(_ server: Server, webSocket: WebSocket, didReceiveMessage message: WebSocketMessage) {
        switch (message.opcode) {
        case .binaryFrame: audit("web socket did receive binary frame op-code")
        case .connectionClose: audit("web socket did receive connection close op-code")
        case .continuationFrame: audit("web socket did receive continuation frame op-code")
        case .ping: audit("web socket did receive ping op-code")
        case .pong: audit("web socket did receive pong op-code")
        case .textFrame: audit("web socket did receive text frame op-code \(String(data: message.payload.data!, encoding: .utf8)!)")
        }
    }
    
    func server(_ server: Server, webSocket: WebSocket, didSendMessage message: WebSocketMessage) {
        audit("web socket did send message")
    }
    
    func serverDidDisconnect(_ server: Server) {
        audit("server did disconnect")
    }
}

extension ViewController: WKUIDelegate {
    
}
