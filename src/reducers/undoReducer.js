export default function undoReducer( state = [], action ) {
  switch (action.type) {
    case "PUSH_TO_UNDO_STACK":
      return [...state, action.stateToPush];
    case "POP_UNDO_STACK":
      let newState = [...state];
      newState.pop();
      return newState;
    case "CLEAR_UNDO_STACK":
      return [];
    default:
      return state;
  }
}
