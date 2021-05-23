import { Graphony } from '../Graphony.js';

describe('get()', () => {
  let as;
  beforeEach(() => {
    as = new Graphony();
  });
  afterEach(() => {
    as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.get).to.exist;
  });

  it('should get/create a root path', () => {
    as.get();
    expect(as.currentPath).to.be.equal('root');
  });

  it('should create a nested path', () => {
    const foo = as.get().get('user').get('rob');
    expect(foo.currentPath).to.be.equal('root.user.rob');
  });

  it('should create a deeply nested path', () => {
    const bar = as.get().get('user').get('rob').get('wife');
    expect(bar.currentPath).to.be.equal('root.user.rob.wife');
  });

  it('should get a complex path (one with periods)', () => {
    as.get('root.user.rob');
    expect(as.currentPath).to.be.equal('root.user.rob');
    const node = as.nodes.get(as.currentPath);
    expect(node.path).to.be.equal('root.user.rob');
  });

  it('should set a value', () => {
    const value = { firstName: 'Rob', lastName: 'Hicks' };
    as = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
    const foo = as.get().get('user').set(value);
  });

  it('should web socket', () => {
    as = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
    as.get().get('user').set({ firstName: 'Rob', lastName: 'Hicks' });
  });
});
