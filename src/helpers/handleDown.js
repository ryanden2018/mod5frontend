import { Vector2 } from 'three';
import width from '../constants/width';
import height from '../constants/height';

export default function handleDown(pageX,pageY) {
  let mouse = new Vector2();
  mouse.x = ((pageX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
  mouse.y = -((pageY-this.renderer.domElement.offsetTop) / height) * 2 + 1;
  this.props.setMouseDown(mouse.x,mouse.y)
  this.raycaster.setFromCamera( mouse, this.camera);
  var furnishing = null;
  var dist = -1;
  this.props.room.forEach( thisFurnishing => {
    var thisDist = thisFurnishing.checkIntersect(this.raycaster);
    if(thisDist > -0.99) {
      if((dist<-0.99) || (thisDist < dist)) {
        dist = thisDist;
        furnishing = thisFurnishing;
      }
    }
  });
  if(furnishing) {
    if( (this.props.mode.mode === "move") || (this.props.mode.mode === "rotate") ) {
      this.pushRoomToUndoStack();
      this.props.socket.emit("pushRoomToUndoStack");
      this.props.socket.emit("clearRedoStack");
      this.props.socket.emit("lockRequest",{furnishingId:furnishing.id});
      this.props.setLockRequested();
      this.props.setFurnishing(furnishing.id);
      if(this.props.username === "dummy") {
        this.props.setLockApproved();
      }
    } else if (this.props.mode.mode === "color") {
      this.props.socket.emit("updateColor",{furnishingId:furnishing.id,colorName:this.props.mode.colorName});
      this.props.setMode("move");
    } else if (this.props.mode.mode === "delete") {
      this.props.socket.emit("deleteFurnishing",{furnishingId:furnishing.id});
      this.props.setMode("move");
    }
  }
}