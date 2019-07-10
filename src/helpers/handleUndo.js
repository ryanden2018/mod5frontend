export default function handleUndo(room) {
  if(this.props.roomProperties) {
    this.pushRoomToRedoStack();
    this.loadRoomFromState(room);
    this.props.popUndoStack();
  }
}
