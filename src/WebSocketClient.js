import { uuid } from './utils/uuid';

const autoReconnectInterval = 2000;

export class WebSocketClient {
  constructor(ctx, wsc) {
    this.ctx = ctx;
    this.intervalId = null;
    this.requestQue = [];
    this.url = wsc.url;
    if (wsc.url && wsc.url.includes('ws')) {
      this.connect();
    }
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);
      this.socket.onclose = (ev) => {
        switch (ev) {
        case 1000:
          // eslint-disable-next-line
          console.log('WebSocket closed normally');
          break;
        default:
          // eslint-disable-next-line
          console.log('WebSocket closed abnormally');
          this.reconnect();
          break;
        }
      };

      this.socket.onerror = () => this.reconnect();
      this.socket.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        const { action, data: dta, path } = data;
        if (action === 'RESPONSE') {
          const node = this.ctx.nodes.get(path);
          const d = JSON.parse(dta);
          // const node = getNode(path);
          console.log('node', node);
        }
      };
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify({ action: 'registerClient', data: { clientId: uuid() } }));
      };
      if (this.intervalId) clearInterval(this.intervalId);
    } catch (e) {
      this.reconnect();
    }
  }

  reconnect() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      console.log(`WebSocketClient: retry to ${this.url} in ${autoReconnectInterval}ms`);
      if (this.socket && this.socket.readyState !== '1' && this.socket.readyState !== 0) this.connect();
    }, autoReconnectInterval);
  }
}
