export default function redoReducer( state = [], action ) {
  switch (action.type) {
    case "PUSH_TO_REDO_STACK":
      return [...state, action.stateToPush];
    case "POP_REDO_STACK": {
      let newState = [...state];
      newState.pop();
      return newState;
    }
    case "CLEAR_REDO_STACK":
      return [];
    default:
      return state;
  }
}
