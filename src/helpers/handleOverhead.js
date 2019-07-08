export default function handleOverhead() {
  this.setState( { rotatingCameraMode: false, overheadView: true } );
  this.camera.position.x = 0.0;
  this.camera.position.y = this.props.roomProperties.width*0.95;
  this.camera.position.z = 0.0;
  this.camera.rotation.x = -Math.PI/2;
  this.camera.rotation.y = 0.0;
  this.camera.rotation.z = 0.0;
  this.renderer.render(this.scene,this.camera);
}