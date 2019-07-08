export default function handleMouseMove(event) {
  event.preventDefault();
  this.handleMove(event.pageX,event.pageY,event.movementX,event.movementY);
}