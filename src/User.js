import { isArray } from './utils/isArray';
import { uuid } from './utils/uuid';
import encrypt from './utils/encrypt';
import decrypt from './utils/decrypt';

const userIdString = 'graphony-user-id';

export default class User {
  constructor(ctx) {
    this._authenticated = false;
    this.jwt = null;
    this._permissions = [];
    this.uuid = sessionStorage.getItem(userIdString) || uuid();
    sessionStorage.setItem(userIdString, this.uuid);
    this.get = ctx.get.bind(ctx);
    this.set = ctx.set.bind(ctx);
    this.rpcClient = ctx.rpcClient;
    this.rpcUri = ctx.rpcUri;
  }

  authChange(cb) {
    cb(this.authenticated);
  }

  createAccount(username, password) {
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'CREATE_ACCOUNT', data: { username, password, id: this.uid } });
    }
  }

  createProfile(data) {
    this.get()
      .get('users')
      .get(this.uid)
      .get('profile')
      .set(data);
  }

  deleteAccount() {
    this.get()
      .get('users')
      .get(this.uid)
      .set(null);
  }

  deleteProfile() {
    this.get()
      .get('users')
      .get(this.uid)
      .get('profile')
      .set(null);
  }

  login(username, password) {
    if (this.isBrowser) {
      if (this?.wsc && this.wsc.ready()) {
        this.wsc.send({ action: 'LOGIN', data: { username, password, id: this.uid } });
      } else {
        // log user in
      }
    }
  }

  logout() {
    if (this.isBrowser && this?.wsc?.send) {
      this.wsc.send({ action: 'LOGOUT', data: { id: this.uid } });
      this.authenticated = false;
    }
  }

  async uniqueEmail(email, cb) {
    if (this.isBrowser) {
      const emailUnique = this.rpcClient.request(this.rpcUri.query.set({}));
    }
  }

  updateProfile(data) {
    this.get()
      .get('users')
      .get(this.uid)
      .get('profile')
      .put(data);
  }

  get authenticated() {
    return this._authenticated;
  }

  set authenticated(flag) {
    this._authenticated = flag;
    this.events.emit('authChange', this._authenticated);
  }

  get permissions() {
    return this._permissions;
  }

  set permissions(perms = []) {
    if (!isArray(perms)) throw new SyntaxError('permissions must be an array of strings');
    perms.forEach((perm) => {
      if (typeof perm !== 'string') throw new SyntaxError('permissions must contain only strings');
    });
    this._permissions = perms;
  }

  get uid() {
    return this.uuid;
  }

  set uid(uid) {
    this.uuid = uid;
  }
}

User.prototype.encrypt = encrypt;
User.prototype.decrypt = decrypt;
