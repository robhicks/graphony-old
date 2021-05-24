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
        ws.on('message', async (msg) => {
          const message = JSON.parse(msg);
          // console.log('message', message);
          const { action } = message;
          const { path } = message;
          const { data } = message;

          switch (action) {
          case 'REGISTER_CLIENT':
            Object.assign(ws, { clientId: data.clientId, paths: new Set() });
            break;
          case 'REGISTER_NODE':
            ws.paths.add(path);
            break;
          case 'GET': {
            const val = await this.store.get(path);
            const payload = { action: 'RESPONSE', path, data: val || {} };
            ws.send(JSON.stringify(payload));
            break;
          }
          case 'PUT': {
            this.store.put(path, data);
            this.wss.clients.forEach((client) => {
              if (client !== ws && client.paths && client.paths.has(path)) {
                client.send(message);
              }
            });
            break;
          }

          default: break;
          }
        });
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('error starting:', e);
    }
  }
}
