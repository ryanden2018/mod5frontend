export default function moveZ(diffZ, furnishingId) {
  var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
  furnishing.moveZ(diffZ);
  this.renderer.render(this.scene,this.camera);
}