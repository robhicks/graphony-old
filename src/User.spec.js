import { Graphony } from './Graphony';
import { expect } from 'chai';
import User from './User'

describe('User', () => {
  let graphony;
  before(() => {
    graphony = new Graphony();
  });
  after(() => {
    graphony.reset();
  });

  it('should be an instance of User', () => {
    expect(graphony.user).to.be.instanceOf(User)
  });

  it('should have certain properties and methods', () => {
    expect(graphony.user.authenticated).to.be.a('boolean');
    expect(graphony.user.uid).to.be.a('string');
    expect(graphony.user.authChange).to.be.a('function');
    expect(graphony.user.createAccount).to.be.a('function');
    expect(graphony.user.createProfile).to.be.a('function');
    expect(graphony.user.deleteAccount).to.be.a('function');
    expect(graphony.user.deleteProfile).to.be.a('function');
    expect(graphony.user.login).to.be.a('function');
    expect(graphony.user.logout).to.be.a('function');
    expect(graphony.user.updateProfile).to.be.a('function');
  });

  it('should have an authChange listener ', () => {
    expect(graphony.events.size).to.be.equal(1);
  });

});