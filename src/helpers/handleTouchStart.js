export default function handleTouchStart(event) {
  this.handleDown(event.touches[0].pageX,event.touches[0].pageY);
}