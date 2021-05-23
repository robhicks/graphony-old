// https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/
export class WebSocketServer {
  constructor(options = {}) {
    this.autoRestartInterval = 1000;
    this.port = options.port;
    this.server = options.server;
    this.wss = options.wss;
    this.store = options.store;
    this.start();
  }

  start() {
    // eslint-disable-next-line
    console.log('waiting for wss server to load ...');
    try {
      this.server.listen(this.port);
      this.server.on('listening', () => console.log(`Websocket server listening on port ${this.port}`));
      this.server.on('upgrade', (req, socket, head) => {
        // do authentication here
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, data } = JSON.parse(message);
          if (action === 'registerClient' && this.wss.clients.has(ws) && !ws.clientId) {
            Object.assign(ws, { clientId: data.clientId, paths: new Set() });
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, path } = JSON.parse(message);
          if (action === 'registerNode' && this.wss.clients.has(ws)) {
            ws.paths.add(path);
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
          const { action, path } = JSON.parse(message);
          if (action === 'GET' && this.wss.clients.has(ws)) {
            const val = await this.store.get(path);
            if (val) {
              const payload = { action: 'RESPONSE', path, data: val };
              ws.send(JSON.stringify(payload));
            }
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, data, path } = JSON.parse(message);
          if (action === 'PUT') {
            this.store.put(path, data);
          }
          this.wss.clients.forEach((client) => {
            if (client !== ws && client.paths && client.paths.has(path)) {
              client.send(message);
            }
          });
        });
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('error starting:', e);
    }
  }
}