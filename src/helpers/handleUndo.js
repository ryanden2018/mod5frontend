export default function handleUndo(emit = false) {
  if(this.props.roomProperties) {
    if(this.props.undo.length > 0) {
      this.pushRoomToRedoStack();
      if(emit) {
        this.props.socket.emit("undo", {room:this.props.undo[this.props.undo.length-1]});
      }
      let prevState = this.props.undo[this.props.undo.length-1];
      this.loadRoomFromState(prevState);
      this.props.popUndoStack();
    }
  }
}
