export default function handleRedo(room) {
  if(this.props.roomProperties) {
    this.pushRoomToUndoStack();
    this.loadRoomFromState(room);
    this.props.popRedoStack();
  }
}
