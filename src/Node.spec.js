import Node from './Node';
import { Graphony } from './Graphony';

const graphony = new Graphony();

describe('Node', () => {
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    await graphony.store.clear();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox.reset();
    await graphony.store.clear();
  });

  describe('load()', () => {
    it.skip('should get a value stored in the db', async () => {
      const node = new Node('root.users.robby', graphony);
      node.value = {name: 'robby'}
      expect(node.value.name).to.be.equal('rob');
    });
  });
});
