import resolveGet from './resolveGet';
import resolvePut from './resolvePut';
import resolveDel from './resolveDel';

export default function resolveConflict({ method, clientData, serverData }) {
  switch (method) {
  case 'GET': return resolveGet(clientData, serverData);
  case 'PUT': return resolvePut(clientData, serverData);
  case 'DEL': return resolveDel(clientData, serverData);
  default: return null;
  }
}
