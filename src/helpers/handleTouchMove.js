export default function handleTouchMove(event) {
  let lastTouchMoveX = this.lastTouchMoveX;
  let lastTouchMoveY = this.lastTouchMoveY;
  this.lastTouchMoveX = event.touches[0].pageX;
  this.lastTouchMoveY = event.touches[0].pageY;
  if(lastTouchMoveX && lastTouchMoveY) {
    this.handleMove(event.touches[0].pageX,event.touches[0].pageY,
      event.touches[0].pageX-lastTouchMoveX,
      event.touches[0].pageY-lastTouchMoveY);
  }
}