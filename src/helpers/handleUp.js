export default function handleUp() {
  if(this.props.lock.lockObtained && this.props.lock.furnishingId) {
      this.props.clearRedoStack();
      this.props.socket.emit("lockRelease",{furnishing:
        this.props.room.find( furnishing => furnishing.id === this.props.lock.furnishingId ) });
      //this.props.dim(this.props.lock.furnishingId,this.props.colors);
      this.props.unLock();
  }
  this.props.unSetMouseDown();
  this.tossGarbage();
}