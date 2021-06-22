export default function resolvePut(clientData, serverData) {
  let obj = {};
  if (serverData) {
    if (clientData) obj = { ...obj, ...serverData, ...clientData };
    else obj = { ...obj, ...serverData };
  } else if (clientData) {
    obj = { ...obj, clientData };
  }
  return obj;
}
