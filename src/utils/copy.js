export function copy(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}
