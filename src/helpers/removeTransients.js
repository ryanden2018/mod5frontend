export default function removeTransients() {
  if(this.scene) { this.scene.dispose(); }
  if(this.floor) {
    this.garbage.push(this.floor.geometry);
    this.garbage.push(this.floor.material);
    delete this.floor;
  }
  if(this.ceiling) {
    this.garbage.push(this.ceiling.geometry);
    this.garbage.push(this.ceiling.material);
    delete this.ceiling;
  }
  if(this.wallLeft) {
    this.garbage.push(this.wallLeft.geometry);
    this.garbage.push(this.wallLeft.material);
    delete this.wallLeft;
  }
  if(this.wallRight) {
    this.garbage.push(this.wallRight.geometry);
    this.garbage.push(this.wallRight.material);
    delete this.wallRight;
  }
  if(this.wallBack) {
    this.garbage.push(this.wallBack.geometry);
    this.garbage.push(this.wallBack.material);
    delete this.wallBack;
  }
  if(this.wallFront) {
    this.garbage.push(this.wallFront.geometry);
    this.garbage.push(this.wallFront.material);
    delete this.wallFront;
  }
}