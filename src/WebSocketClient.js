import { deserialize } from './utils/deserialize';
import { serialize } from './utils/serialize';
import Node from './Node';

const autoReconnectInterval = 2000;
const maxRetries = 3;
const retryInterval = 100;

export class WebSocketClient {
  constructor(url) {
    this.intervalId = null;
    this.retryIntervalId = null;
    this.subscriptions = new Set();
    this.url = url;
    this.retries = 0;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('close', this.onClose.bind(this));
    this.socket.addEventListener('error', this.onError.bind(this));
    this.socket.addEventListener('message', this.onMessage.bind(this));
    this.socket.addEventListener('open', this.onOpen.bind(this));
  }

  delete({ path, gid }) {
    this.send({ action: 'DELETE', gid, path });
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
    this.socket.close();
  }

  onMessage(msg) {
    // console.log('Client::onMessage::msg', msg);
    const { data } = msg;
    // console.log('onMessage::data', data);
    const obj = deserialize(data);
    // console.log('onMessage::obj', obj);

    const { path } = obj;

    const node = this.nodes.get(path) || new Node(path, this.ctx);
    // console.log('node', node);
    if (obj?.value) node.value = obj;
  }

  onOpen() {
    console.log('connected');
    if (this.intervalId) clearInterval(this.intervalId);
    this.subscriptions.forEach((sub) => {
      // console.log('sub', sub);
      this.send(sub);
    });
  }

  publish(data) {
    this.send(data);
  }

  ready() {
    return this?.socket?.readyState === 1 && this?.socket?.readyState !== 0;
  }

  reconnect() {
    console.count('reconnect');
    console.log(`Socket closed: retry to ${this.url} in ${autoReconnectInterval}ms`);
    setTimeout(() => {
      this.connect();
    }, autoReconnectInterval);
  }

  async rpc({ path, gid }) {
    this.send({ action: 'RPC', gid, path });
  }

  send(payload) {
    // console.log('send::payload', payload);
    if (this.ready()) {
      this.retries = 0;
      // console.log('WebsocketClient::send::payload', payload);
      this.socket.send(serialize(payload));
    } else if (this.retries < maxRetries) {
      this.retries += 1;
      setTimeout(() => {
        this.send(payload);
      }, retryInterval);
    }
  }

  subscribe({ path, gid }) {
    const payload = { action: 'SUBSCRIBE', gid, path };
    this.subscriptions.add(payload);
    this.send(payload);
  }
}
