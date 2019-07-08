export default function handleMoveCamera() {
  this.setState( { rotatingCameraMode: false, overheadView: false } )
  this.camera.position.x = 0.0 + this.state.cameraDispX;
  this.camera.position.y =  this.props.roomProperties.height * 0.5;
  this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
  this.camera.rotation.x = 0.0;
  this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
  this.camera.rotation.z = 0.0;
  this.renderer.render(this.scene,this.camera);
}