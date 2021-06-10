const {NeuralNetwork} = require('brain.js')

const net = new NeuralNetwork({hiddenLayers: [3]});

const trainingData = [
  { input: { method: 'GET', path: 'root.translations.en', updated: 1622179466}}
  { input: [0,0], output: [0]},
  { input: [0,1], output: [1]},
  { input: [1,0], output: [1]},
  { input: [1,1], output: [0]},
]

net.train(trainingData, {
  log: error => console.log(`error`, error),
  logPeriod: 100
})

// console.log(`net.run([0,0])`, net.run([0,0]))
// console.log(`net.run([0,1])`, net.run([0,1]))
// console.log(`net.run([1,0])`, net.run([1,0]))
// console.log(`net.run([1,1])`, net.run([1,1]))