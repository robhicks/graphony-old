import { expect } from 'chai';
import {Graphony} from '../Graphony';

describe('on()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony();
  });

  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.on).to.exist;
  });

  it(`should get an updated value from an object`, () => {
    let set = {name: 'foo'};
    let change = {name: 'bar'};
    graphony
      .get()
      .set(set)
      .on(val => {
        // console.log(`val`, val)
        expect(val).to.be.eql(change);
      })
      .put(change);
  });

  it(`should get an updated value from an array`, () => {
    let original = [{name: 'foo'}];
    let change = {name: 'bar'};
    graphony
      .get()
      .set(original)
      .on(val => {
        // console.log(`val`, val)
        expect(val).to.be.an('array');
        expect(val).to.have.length(2);
        expect(val[0]).to.be.eql({name: 'foo'});
        expect(val[1]).to.be.eql(change);
      })
      .push(change);
  });

  it(`should get an updated value from an array`, () => {
    let original = {name: 'foo'};
    let change = {name: 'bar'};
    graphony
      .get()
      .set([])
      .push(original)
      .on(val => {
        // console.log(`val`, val)
        expect(val).to.be.an('array');
        expect(val).to.have.length(2);
        expect(val[0]).to.be.eql(original);
        expect(val[1]).to.be.eql(change);
      })
      .push(change)
  });

  it('should get the value of an object stored by reference', () => {
    let obj = {name: 'foo'};
    graphony
      .get()
      .get('rob')
      .set(obj)
      .get()
      .get('users')
      .set([])
      .on(val => {
        // console.log(`val`, val)
        expect(val).to.be.eql([obj])
      })
      .push('root.rob');
  });

  it(`should return a static path that can be assigned to a variable`, () => {
    const user = graphony.get().get('machines').get('foo').get('users').get('rob');
    user
      .set({ givenName: 'Rob', surname: "Hicks" })
      .once(val => {
        // console.log(`val`, val)
        expect(val.givenName).to.equal('Rob')
        expect(val.surname).to.equal('Hicks')
      })
  });
});
