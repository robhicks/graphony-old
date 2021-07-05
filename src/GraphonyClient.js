import { FetchClient, jsonRequest, jsonResponse } from 'tiny-fetch-interceptors';
import TinyUri from 'tiny-uri';
import { Graphony } from './Graphony';
import { IdbKeyValStore } from './utils/IdbKeyValStore';
import { WebSocketClient } from './WebSocketClient';
import User from './User';

const interceptors = [jsonRequest, jsonResponse];

export class GraphonyClient extends Graphony {
  constructor(options = {}) {
    super(options);
    this.rpcClient = new FetchClient(interceptors);
    super.store = new IdbKeyValStore();
    this.rpcUri = new TinyUri(options.rpcUrl);
    this.wsUrl = options.wsUrl;
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
