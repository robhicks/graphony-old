const MongoDbStore = require('../src/utils/MongoDbStore')

const uri = 'mongodb://localhost:27017'

const store = new MongoDbStore(uri);

store.set('root', {name: 'glenda loreen hicks'})
