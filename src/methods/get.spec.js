import { Graphony } from '../Graphony.js';

describe('get()', () => {
  let graphony;
  beforeEach(() => {
    graphony = new Graphony();
  });
  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.get).to.exist;
  });

  it('should get/create a root path', () => {
    graphony.get();
    expect(graphony.currentPath).to.be.equal('root');
  });

  it('should create a nested path', () => {
    const foo = graphony.get().get('user').get('rob');
    expect(foo.currentPath).to.be.equal('root.user.rob');
  });

  it('should create a deeply nested path', () => {
    const bar = graphony.get().get('user').get('rob').get('wife');
    expect(bar.currentPath).to.be.equal('root.user.rob.wife');
  });

  it('should get a complex path (one with periods)', () => {
    graphony.get('root.user.rob');
    expect(graphony.currentPath).to.be.equal('root.user.rob');
    const node = graphony.nodes.get(graphony.currentPath);
    expect(node.path).to.be.equal('root.user.rob');
  });

  it('should set a value', () => {
    const value = { firstName: 'Rob', lastName: 'Hicks' };
    graphony = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
    const foo = graphony.get().get('user').set(value);
  });

  it('should web socket', () => {
    graphony = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
    graphony.get().get('user').set({ firstName: 'Rob', lastName: 'Hicks' });
  });
});
