export default function pushRoomToRedoStack() {
  // record an object representation of every furnishing in the room
  let oldState = this.props.room.map( furnishing => furnishing.objVal() );
  this.props.pushToRedoStack(oldState);
}
