export default function handleRedo(emit = false) {
  if( this.props.roomProperties ) {
    if(this.props.redo.length > 0) {
      this.pushRoomToUndoStack();
      if(emit) {
        this.props.socket.emit("redo", {room:this.props.redo[this.props.redo.length-1]});
      }
      let prevState = this.props.redo[this.props.redo.length-1];
      this.loadRoomFromState(prevState);
      this.props.popRedoStack();
    }
  }
}
