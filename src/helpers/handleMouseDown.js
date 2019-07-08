export default function handleMouseDown(event) {
  event.preventDefault();
  this.handleDown( event.pageX, event.pageY );
}