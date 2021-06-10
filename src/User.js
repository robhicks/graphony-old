import { isArray } from './utils/isArray';
import { uuid } from './utils/uuid';

export default class User {
  constructor(ctx) {
    this._authenticated = false;
    Object.assign(this, ctx);
    this.uid = uuid();
    this.jwt = null;
    this.events.on('authChange', this.authChange);
    this._permissions = [];
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
    if (this.isBrowser && this?.wsc?.send) {
      this.wsc.send({ action: 'LOGIN', data: { username, password, id: this.uid } });
    }
  }

  logout() {
    if (this.isBrowser && this?.wsc?.send) {
      this.wsc.send({ action: 'LOGOUT', data: { id: this.uid } });
      this.authenticated = false;
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
}
