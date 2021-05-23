import { Graphony } from './Graphony';
import baseUrl from './utils/baseUrl';
import { expect } from 'chai';

describe('Graphony', () => {
  const url = baseUrl().replace('8080', '8081').replace('http', 'ws');
  const wsc = new WebSocket(url)
  let as;
  before(() => {
    as = new Graphony({wsc});
  });
  after(() => {
    as.reset();
  });

  it('when instantiated should have certain properties', () => {
    expect(as.del).to.be.an('function');
    expect(as.get).to.be.an('function');
    // expect(as.on).to.be.an('function');
    expect(as.once).to.be.an('function');
    // expect(as.pop).to.be.an('function');
    // expect(as.put).to.be.an('function');
    expect(as.put).to.be.an('function');
    expect(as.set).to.be.an('function');
    // expect(as.shift).to.be.an('function');
    // expect(as.splice).to.be.an('function');
    // expect(as.unshift).to.be.an('function');
  });

  it('should get a node if it exists', () => {
    as.get();
    expect(as.nodes.get('root')).to.be.ok;
  });

  it('should get a Map of nodes', () => {
    as
      .get()
      .get('user')
      .get('rob');

    expect(as.nodes.size()).to.be.equal(3);
  });

  it('should connect to a server', () => {
    expect(as.wsc).to.exist;
  });

  it(`should set a node value`, () => {
    const obj = {name: 'rob'};
    as
      .get()
      .get('users')
      .get('rob')
      .set(obj)
      .once(val => {
        expect(val).to.eql(obj)
      });
  });
});
