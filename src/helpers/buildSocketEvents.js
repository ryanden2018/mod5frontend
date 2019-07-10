import apiurl from '../constants/apiurl';

export default function buildSocketEvents() {
  this.props.socket.on('disconnect', () => {
    this.props.setErrMsg( "There is a problem with the connection." );
    this.disposeAllFurnishings(true);
    this.props.resetEverything();
  });

  this.props.socket.on('reconnect',() => {
    this.props.setErrMsg("");
    this.props.socket.emit("loggedInReconnectEvent");
  });

  this.props.socket.on('loggedInReconnectEventResponse', msg => {
    if(msg === "logged in") {
      if(this.state.roomId) {
        this.openRoom(this.state.roomId);
      }
    } else {
      this.disposeAllFurnishings(true);
      this.props.resetEverything();
      this.props.modeLogout();
      this.props.lockLogout();
      this.props.fileLogout();
      this.props.roomLogout();
      fetch(`${apiurl}/api/login`, {method:'DELETE',credentials:'include'})
      .then( () => this.props.history.push("/") );
    }
  });

  this.props.socket.on('roomDeleted',() => {
    this.props.setErrMsg("The room was deleted.");
    this.props.socket.emit("removeFromAllRooms");
    this.disposeAllFurnishings(true);
    this.props.resetEverything();
  });

  this.props.socket.on("create",payload=>{
    this.pushRoomToUndoStack();
    this.props.clearRedoStack();
    this.props.addFurnishingFromObject(payload.furnishing,this.props.colors,this.renderer,this.camera,this.scene)
  });

  this.props.socket.on("lockResponse",payload=>{
    if(payload === "approved") {
      this.props.setLockApproved();
    } else {
      this.props.unLock();
    }
  });

  this.props.socket.on("pushRoomToRedoStack",payload=>{
    this.pushRoomToRedoStack();
  });

  this.props.socket.on("pushRoomToUndoStack", payload=>{
    this.pushRoomToUndoStack();
  });

  this.props.socket.on("clearRedoStack",payload=>{
    this.props.clearRedoStack();
  });

  this.props.socket.on("clearUndoStack", payload=>{
    this.props.clearUndoStack();
  });

  this.props.socket.on("undo",payload=>{
    this.handleUndo(payload.room);
  });

  this.props.socket.on("redo",payload=>{
    this.handleRedo(payload.room);
  });

  this.props.socket.on("update", payload => {
    let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishing.id );
    if(furnishing) {
      furnishing.updateFromObject(payload.furnishing,this.props.colors);
      this.renderer.render(this.scene,this.camera);
    }
  });

  this.props.socket.on("delete", payload=>{
    let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId);
    if(furnishing) {
      this.pushRoomToUndoStack();
      this.props.clearRedoStack();
      furnishing.removeFrom(this.scene);
      this.props.deleteFurnishing(payload.furnishingId);
      this.renderer.render(this.scene,this.camera);
    }
  });

  this.props.socket.on("colorUpdate",payload=>{
    let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId );
    if(furnishing) {
      this.pushRoomToUndoStack();
      this.props.clearRedoStack();
      furnishing.colorName = payload.colorName;
      furnishing.red = this.props.colors[payload.colorName].red;
      furnishing.green = this.props.colors[payload.colorName].green;
      furnishing.blue = this.props.colors[payload.colorName].blue;
      furnishing.fillColor();
      this.renderer.render(this.scene,this.camera);
    }
  });

  this.props.socket.on("availableRooms", payload => {
    this.props.setAvailableRooms(payload.availableRooms)
  });

  this.props.socket.on("mouseMoved",payload => {
    let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId );
    if(furnishing) {
      furnishing.moveX(payload.diffX);
      furnishing.moveZ(payload.diffZ);
      furnishing.moveTheta(payload.diffTheta);
      this.renderer.render(this.scene,this.camera);
    }
  });
}