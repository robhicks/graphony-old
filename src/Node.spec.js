import Node from './Node';
import { Graphony } from './Graphony';

const as = new Graphony();

describe('Node', () => {
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    await as.store.clear();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox.reset();
    await as.store.clear();
  });

  describe('load()', () => {
    it('should get a value stored in the db', async () => {
      const node = new Node('root', as);
      await node.setValue({name: 'rob'})
      await node.load();
      const val = await node.getValue();
      expect(val).to.be.an('object');
      expect(val.name).to.be.equal('rob');
    });
  });
});
