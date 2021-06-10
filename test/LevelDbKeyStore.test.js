const level = require('level');
const { LevelKeyStore } = require('../index.js');
const { resolve } = require('path');
const root = process.cwd();

const store = new LevelKeyStore(level, resolve(root, 'GraphonyDb'));

store.set('foobar', {name: 'rob'})
  .then(() => store.get('foobar'))
  .then(val => console.log(`val`, val))
  .then(() => store.put('foobar', {lastname: 'hicks'}))
  .then(() => store.get('foobar'))
  .then(() => store.set('bar', [{name: 'rob'}]))
  .then(() => store.get('bar'))
  .then(val => console.log(`val`, val))
  .then(() => store.put('bar', [{name: 'glenda'}]))
  .then(() => store.get('bar'))
  .then(val => console.log(`val`, val))
  .then(() => store.del('bar'))
  .then(() => store.get('bar'))
  .then(val => console.log(`val`, val))
