import { uuid } from './utils/uuid';

const autoReconnectInterval = 2000;

const deserialize = (payload) => JSON.parse(payload);
const serialize = (payload) => JSON.stringify(payload);

export class WebSocketClient {
  constructor(url) {
    this.intervalId = null;
    this.requestQue = [];
    this.url = url;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('close', this.onClose.bind(this));
    this.socket.addEventListener('error', this.onError.bind(this));
    this.socket.addEventListener('message', this.onMessage.bind(this));
    this.socket.addEventListener('open', this.onOpen.bind(this));
  }

  connecting() {
    return this?.socket?.readyState === 0;
  }

  onClose(ev) {
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
  }

  onError(evt) {
    // eslint-disable-next-line
    console.warn('evt', evt);
    this.reconnect();
  }

  onMessage(msg) {
    const { data } = msg;
    const { data: { message }, path } = deserialize(data);
    const node = this.nodes.get(path);
    if (node) node.setValue(message);
  }

  onOpen() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.socket.send(serialize({ action: 'REGISTER_CLIENT', data: { clientId: uuid() } }));
  }

  ready() {
    return this?.socket?.readyState === 1;
  }

  reconnect() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      console.log(`WebSocketClient: retry to ${this.url} in ${autoReconnectInterval}ms`);
      if (!this.ready() && !this.connecting()) this.connect();
    }, autoReconnectInterval);
  }

  send(payload) {
    this.socket.send(serialize(payload));
  }
}
