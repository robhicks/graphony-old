import { uuid } from './utils/uuid';

export default class User {
  constructor(ctx) {
    this.authenticated = false;
    Object.assign(this, ctx);
    this.uid = uuid();
    this.jwt = null;
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
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'LOGIN', data: { username, password, id: this.uid } });
    }
  }

  logout() {
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'LOGOUT', data: { id: this.uid } });
    }
  }
}
