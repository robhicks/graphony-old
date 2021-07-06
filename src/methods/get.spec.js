import { expect } from 'chai';
import { Graphony } from '../Graphony.js';
import User from '../User'

describe('get()', () => {
  let graphony, g1;
  beforeEach(() => {
    graphony = new Graphony();
  });
  afterEach(() => {
    graphony.reset();
    if (g1) g1.reset();
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

  it('should assign readers and writers', async() => {
    const reader = new User(graphony).uid
    const writer = new User(graphony).uid
    const readers = [reader];
    const writers = [writer];
    graphony.get('root', {readers, writers}).set({name: 'rob'})
    const storedObject = await graphony.store.get('root');
    expect(storedObject.readers).to.contain(reader)
    expect(storedObject.writers).to.contain(writer);
  });

  it('an owner can get the values of a path', () => {
    const reader = new User(graphony).uid
    const writer = new User(graphony).uid
    const readers = [reader];
    const writers = [writer];
    graphony
      .get('root', { readers, writers })
      .once(val => {
        // console.log(`val`, val)
        expect(val.name).to.equal('rob')
      })
      .set({ name: 'rob' })
  });

  it.skip('the value of a path cannot be read by a user who is not the owner, or a reader or writer', (done) => {
    const reader = new User(graphony).uid
    const writer = new User(graphony).uid
    const readers = [reader];
    const writers = [writer];

    g1 = new Graphony();

    g1.get().once(val => {
      console.log(`val`, val)
      expect(val).to.be.null;
      done()
    })
    graphony.get('root', { readers, writers }).set({ name: 'rob' })
  });

  it('the value of a path can be read by a user who is a reader but not the owner', async () => {
    const reader = new User(graphony).uid
    const writer = new User(graphony).uid
    const readers = [reader];
    const writers = [writer];

    g1 = new Graphony();
    g1.get('root', {readers}).on(val => expect(val.name).to.equal('rob'))
    graphony.get('root', { readers, writers }).set({ name: 'rob' })
  });

  it('the value of a path can be read by a user who is a writer but not the owner', async () => {
    const reader = new User(graphony).uid
    const writer = new User(graphony).uid
    const readers = [reader];
    const writers = [writer];

    g1 = new Graphony();
    g1.get('root', { writers }).on(val => expect(val.name).to.equal('rob'))
    graphony.get('root', { readers, writers }).set({ name: 'rob' })
  });


});
