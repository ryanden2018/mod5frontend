export default function handleTouchEnd(event) {
  this.lastTouchMoveX = null;
  this.lastTouchMoveY = null;
  this.handleUp();
}