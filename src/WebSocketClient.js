import { uuid } from './utils/uuid';
import Node from './Node';

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
    // console.log('onMessage::msg', msg);
    const { data } = msg;
    // console.log('onMessage::data', data);
    const obj = deserialize(data);
    // console.log('onMessage::obj', obj);

    const { path } = obj;
    // console.log('path', path);
    const { value } = obj;
    // console.log('value', value);
    const node = this.nodes.get(path) || new Node(path, this.ctx);
    // console.log('node', node);
    delete Object.action;
    if (value) node.setValue(value, obj);
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
      // eslint-disable-next-line
      console.log(`WebSocketClient: retry to ${this.url} in ${autoReconnectInterval}ms`);
      if (!this.ready() && !this.connecting()) this.connect();
    }, autoReconnectInterval);
  }

  send(payload) {
    console.log('WebSocketClient::send::payload', payload);
    this.socket.send(serialize(payload));
  }
}
