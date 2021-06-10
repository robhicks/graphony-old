import isEqual from 'lodash.isequal';

function resolveGet(clientData, serverData) {
  let obj = {};
  if (!clientData && !serverData) return null;
  if (clientData && !serverData) obj = { ...obj, ...clientData };
  else if (!clientData && serverData) obj = { ...obj, ...serverData };
  else if (clientData?.version > serverData?.version) {
    obj = { ...obj, ...serverData, ...clientData };
  } else if (clientData?.version < serverData?.version) {
    obj = { ...obj, ...clientData, ...serverData };
  } else if (clientData?.updated > serverData?.updated) {
    obj = { ...obj, ...serverData, ...clientData };
  } else if (clientData?.updated < serverData?.updated) {
    obj = { ...obj, ...clientData, ...serverData };
  } else obj = { ...obj, ...clientData };
  return obj;
}

function resolvePut(clientData, serverData) {
  let obj = {};
  if (serverData) {
    if (clientData) obj = { ...obj, ...serverData, ...clientData };
    else obj = { ...obj, ...serverData };
  } else if (clientData) {
    obj = { ...obj, clientData };
  }
  return obj;
}

function resolveDel(clientData, serverData) {

}

function resolveConflict({ method, clientData, serverData }) {
  switch (method) {
  case 'GET': return resolveGet(clientData, serverData);
  case 'PUT': return resolvePut(clientData, serverData);
  case 'DEL': return resolveDel(clientData, serverData);
  default: return null;
  }
}

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
      // eslint-disable-next-line no-console
      this.server.on('listening', () => console.log(`Websocket server listening on port ${this.port}`));
      this.wss.on('connection', (ws) => {
        ws.on('message', async (msg) => {
          const message = JSON.parse(msg);
          // console.log('message', message);
          const { action } = message;
          const { path } = message;
          const { data } = message;
          // console.log('action', action);
          switch (action) {
          case 'REGISTER_CLIENT':
            // Object.assign(ws, { clientId: data.clientId, paths: new Set() });
            break;
          case 'GET': {
            const serverData = await this.store.get(path);
            const clientData = data;
            let payload = resolveConflict({ method: action, clientData, serverData });

            if (payload) {
              // console.log('PUT::storage payload', payload);
              this.storeData(payload, path);
              // console.log('GET::network payload', payload);
              payload = { ...payload, ...{ action: 'RESPONSE' } };
              if (!isEqual(serverData?.value, clientData?.value)) {
                ws.send(JSON.stringify(payload));
              }
              this.updateClients(ws, data, path);
            }

            break;
          }
          case 'PUT': {
            const serverData = await this.store.get(path);
            const clientData = message;
            delete clientData.action;
            let payload = resolveConflict({ method: action, clientData, serverData });
            // console.log('PUT::payload', payload);

            if (payload) {
              // console.log('PUT::storage payload', payload);
              this.storeData(payload, path);
              // console.log('GET::network payload', payload);
              payload = { ...payload, ...{ action: 'RESPONSE' } };
              if (!isEqual(serverData?.value, clientData?.value)) {
                ws.send(JSON.stringify(payload));
              }
              this.updateClients(ws, data, path);
            }
            break;
          }
          case 'DEL': {
            // console.log('DEL::message', message);
            const conflict = await this.conflictExists(path, 'DEL', data);
            if (conflict) {
              const payload = { path, data: resolveConflict(conflict) };
              this.storeData(payload, path);
              this.updateClients(ws, payload, path);
            }
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

  storeData(payload, path) {
    console.log('storeData::payload', payload);
    this.store.set(path, JSON.stringify(payload));
  }

  updateClients(ws, message) {
    if (message) {
      this.wss.clients.forEach((client) => {
        if (client !== ws) {
          console.log('updateClients::message', message);
          const payload = JSON.stringify(message);
          client.send(payload);
        }
      });
    }
  }
}
