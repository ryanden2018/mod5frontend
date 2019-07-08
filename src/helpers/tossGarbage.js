export default function tossGarbage() {
  while(this.garbage.length > 0) {
    let trash = this.garbage.pop();
    if(trash.dispose) {
      trash.dispose();
    }
  }
}