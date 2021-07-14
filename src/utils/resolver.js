export default function resolver(current, incoming) {
  const { update: currentTimestamp, value: currentValue, version: currentVersion } = current;
  const { update: incomingTimestamp, value: incomingValue, version: incomingVersion } = incoming;
  let retObj = {};
  // console.log('currentTimestamp', currentTimestamp);
  // console.log('currentValue', currentValue);
  // console.log('currentVersion', currentVersion);
  // console.log('incomingTimestamp', incomingTimestamp);
  // console.log('incomingValue', incomingValue);
  // console.log('incomingVersion', incomingVersion);
  if (!currentValue && incomingValue) {
    retObj = { ...retObj, ...incoming };
  } else if (incomingTimestamp > currentTimestamp) {
    retObj = { ...retObj, ...incoming };
  } else if (incomingTimestamp < currentTimestamp) {
    // do nothing
  } else if (incomingVersion > currentVersion) {
    // the timestamps are equal
    retObj = { ...retObj, ...incoming };
  }

  // console.log(`retObj`, retObj)
  return retObj;
}
