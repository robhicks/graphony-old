import { Graphony } from './Graphony';
import baseUrl from './utils/baseUrl';
import { expect } from 'chai';

describe('Graphony', () => {
  const url = baseUrl().replace('8080', '8081').replace('http', 'ws');
  const wsc = new WebSocket(url)
  let graphony;
  before(() => {
    graphony = new Graphony({wsc});
  });
  after(() => {
    graphony.reset();
  });

  it('when instantiated should have certain properties', () => {
    expect(graphony.del).to.be.an('function');
    expect(graphony.get).to.be.an('function');
    // expect(graphony.on).to.be.an('function');
    expect(graphony.once).to.be.an('function');
    // expect(graphony.pop).to.be.an('function');
    // expect(graphony.put).to.be.an('function');
    expect(graphony.put).to.be.an('function');
    expect(graphony.set).to.be.an('function');
    // expect(graphony.shift).to.be.an('function');
    // expect(graphony.splice).to.be.an('function');
    // expect(graphony.unshift).to.be.an('function');
  });

  it('should get a node if it exists', () => {
    graphony.get();
    expect(graphony.nodes.get('root')).to.be.ok;
  });

  it('should get a Map of nodes', () => {
    graphony
      .get()
      .get('user')
      .get('rob');

    expect(graphony.nodes.size()).to.be.equal(3);
  });

  it('should connect to a server', () => {
    expect(graphony.wsc).to.exist;
  });

  it(`should set a node value`, () => {
    const obj = {name: 'rob'};
    graphony
      .get()
      .get('users')
      .get('rob')
      .set(obj)
      .once(val => {
        expect(val).to.eql(obj)
      });
  });
});
