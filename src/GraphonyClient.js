import Kestrel from '@savvagent-os/kestrel';
import jsonRequest from '@savvagent-os/kestrel/interceptors/json-request.js';
import jsonResponse from '@savvagent-os/kestrel/interceptors/json-response.js';
import TinyUri from 'tiny-uri';
import { Graphony } from './Graphony';
import { IdbKeyValStore } from './utils/IdbKeyValStore';
import { WebSocketClient } from './WebSocketClient';
import User from './User';
import isBrowser from './utils/isBrowser';

const interceptors = [jsonRequest, jsonResponse];

export class GraphonyClient extends Graphony {
  constructor(options = {}) {
    super(options);
    this.rpcClient = new Kestrel(interceptors);
    this.rpcUri = new TinyUri(options.rpcUrl);
    this.wsUrl = options.wsUrl;
    if (isBrowser) {
      super.store = new IdbKeyValStore();
      this.wsc = new WebSocketClient(this.wsUrl);
      this.wsc.nodes = this.nodes;
      this.user = new User(this);
      const id = localStorage.getItem('graphony-client-id');
      if (id) this.uuid = id;
      else {
        localStorage.setItem('graphony-client-id', this.uuid);
      }
    }
  }
}
