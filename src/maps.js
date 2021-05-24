export const nodes = new Map();
export const filters = new Map();
export const founds = new Map();

export const getNodes = () => nodes;

export const getNode = (path) => nodes.get(path);

export const nodeExists = (path) => nodes.has(path);

export const addNode = (path, val) => {
  if (!nodes.has(path)) nodes.set(path, val);
  else return nodes.get(path);
};

export const delNode = (path) => nodes.delete(path);

export const clearNodes = () => nodes.clear();

export const numberOfNodes = () => nodes.size;

setInterval(() => {
  console.log('nodes', nodes);
}, 1000);
