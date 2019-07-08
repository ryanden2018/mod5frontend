export default function moveTheta(diffTheta, furnishingId) {
  var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
  furnishing.moveTheta(diffTheta);
  this.renderer.render(this.scene,this.camera);
}