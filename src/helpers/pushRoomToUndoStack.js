export default function pushRoomToUndoStack() {
  // record an object representation of every furnishing in the room
  let oldState = this.props.room.map( furnishing => furnishing.objVal() );
  this.props.pushToUndoStack(oldState);
}
