export default function resolveGet(clientData, serverData) {
  let obj = {};
  if (!clientData && !serverData) return null;
  if (clientData && !serverData) obj = { ...obj, ...clientData };
  else if (!clientData && serverData) obj = { ...obj, ...serverData };
  else if (clientData?.version > serverData?.version) {
    obj = { ...obj, ...serverData, ...clientData };
  } else if (clientData?.version < serverData?.version) {
    obj = { ...obj, ...clientData, ...serverData };
  } else if (clientData?.updated > serverData?.updated) {
    obj = { ...obj, ...serverData, ...clientData };
  } else if (clientData?.updated < serverData?.updated) {
    obj = { ...obj, ...clientData, ...serverData };
  } else obj = { ...obj, ...clientData };
  return obj;
}
