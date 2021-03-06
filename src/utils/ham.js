var Lexical = JSON.stringify;
export default function HAM(machineState, incomingState, currentState, incomingValue, currentValue) {
  if (machineState < incomingState) {
    // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
    return { defer: true }; 
  }
  if (incomingState < currentState) {
    // the incoming value is within the boundary of the machine's state, but not within the range.
    return { historical: true }; 

  }
  if (currentState < incomingState) {
    // the incoming value is within both the boundary and the range of the machine's state.
    return { converge: true, incoming: true }; 
  }
  if (incomingState === currentState) {
    incomingValue = Lexical(incomingValue) || "";
    currentValue = Lexical(currentValue) || "";
    if (incomingValue === currentValue) { // Note: while these are practically the same, the deltas could be technically different
      return { state: true };
    }
    /*
      The following is a naive implementation, but will always work.
      Never change it unless you have specific needs that absolutely require it.
      If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
      As a result, it is highly discouraged to modify despite the fact that it is naive,
      because convergence (data integrity) is generally more important.
      Any difference in this algorithm must be given a new and different name.
    */
    if (incomingValue < currentValue) { // Lexical only works on simple value types!
      return { converge: true, current: true };
    }
    if (currentValue < incomingValue) { // Lexical only works on simple value types!
      return { converge: true, incoming: true };
    }
  }
  return { err: "Invalid CRDT Data: " + incomingValue + " to " + currentValue + " at " + incomingState + " to " + currentState + "!" };
}

