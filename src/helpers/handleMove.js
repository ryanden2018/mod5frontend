import width from '../constants/width';
import height from '../constants/height';

function angle(x,y) {
  if(x>0) {
    return Math.atan(y/x);
  }
  if((x<0) && (y>0)) {
    return Math.PI - Math.atan(Math.abs(y/x));
  }
  if((x<0)&&(y<0)) {
    return -Math.PI + Math.atan(y/x);
  }
}

export default function handleMove(pageX,pageY,movementX,movementY) {
  if(this.props.roomProperties && this.props.lock.lockObtained && this.props.lock.furnishingId && this.props.lock.mouseDown) {
    if(this.props.mode.mode === "move") {
      if(!this.state.overheadView) {
        let a = this.props.roomProperties.width*movementX/width;
        let b = this.props.roomProperties.length*movementY/height;
        let theta = this.state.cameraRotDispY;
        let diffX = a*Math.cos(theta)+b*Math.sin(theta);
        let diffZ = -1*a*Math.sin(theta)+b*Math.cos(theta);
        this.moveX(diffX, this.props.lock.furnishingId);
        this.moveZ(diffZ, this.props.lock.furnishingId);
        this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:diffX, diffZ:diffZ, diffTheta:0.0});
      } else {
        let diffX = this.props.roomProperties.width*movementX/width;
        let diffZ = this.props.roomProperties.length*movementY/height
        this.moveX(diffX, this.props.lock.furnishingId);
        this.moveZ(diffZ, this.props.lock.furnishingId);
        this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:diffX, diffZ:diffZ, diffTheta:0.0});
      }
    } else if (this.props.mode.mode === "rotate") {
      let xval = ((pageX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
      let yval = -((pageY-this.renderer.domElement.offsetTop) / height) * 2 + 1;
      let diffx = xval - this.props.lock.mousex;
      let diffy = yval - this.props.lock.mousey;
      let dx = movementX / width;
      let dy = movementY / height;
      if( (diffx!==0) && (diffy!==0) && (dx!==0) && (dy!==0) ) {
        let theta1 = angle(diffx,diffy);
        let theta2 = angle(diffx+dx,diffy-dy);
        if(Math.abs(theta1-theta2) < Math.PI) {
          let diffTheta = 3*(theta2-theta1);
          this.moveTheta( diffTheta, this.props.lock.furnishingId );
          this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:0.0, diffZ:0.0, diffTheta:diffTheta})
        }
      }
    }
  } else if ( this.props.roomProperties && this.props.lock.mouseDown ) {
    if( (!this.state.rotatingCameraMode) && (!this.state.overheadView) ) {
      let a = -this.props.roomProperties.width*movementX/width;
      let b = -this.props.roomProperties.length*movementY/height;
      let theta = this.state.cameraRotDispY;
      this.setState({
        cameraDispX: this.state.cameraDispX + a*Math.cos(theta) + b*Math.sin(theta),
        cameraDispZ: this.state.cameraDispZ - a*Math.sin(theta) + b*Math.cos(theta) },
        () => {
          this.camera.position.x = 0.0 + this.state.cameraDispX;
          this.camera.position.y =  this.props.roomProperties.height * 0.5;
          this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
          this.camera.rotation.x = 0.0;
          this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
          this.camera.rotation.z = 0.0;
          this.renderer.render(this.scene,this.camera);
         } )
    } else if (!this.state.overheadView) {
      this.setState({
        cameraRotDispY: this.state.cameraRotDispY + 5*movementX/width
      }, () => {
        this.camera.position.x = 0.0 + this.state.cameraDispX;
        this.camera.position.y =  this.props.roomProperties.height * 0.5;
        this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
        this.camera.rotation.x = 0.0;
        this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
        this.camera.rotation.z = 0.0;
        this.renderer.render(this.scene,this.camera);
      });
    }
  }
}
