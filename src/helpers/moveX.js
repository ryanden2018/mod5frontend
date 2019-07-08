export default function moveX(diffX, furnishingId) {
  var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
  furnishing.moveX(diffX);
  this.renderer.render(this.scene,this.camera);
}