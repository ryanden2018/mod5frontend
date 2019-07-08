import { Scene, Color } from 'three';

export default function disposeAllFurnishings(reRender) {
  if(this.props.room) {
    for(let i = 0; i < this.props.room.length; i++) {
      let furnishing = this.props.room[i];
      furnishing.removeFrom(this.scene);
    }
    this.props.removeAllFurnishings();
    if(reRender) {
      this.scene.dispose();
      this.scene = new Scene();
      this.scene.background = new Color(0xffffff);
      this.renderer.render(this.scene,this.camera);
    }
  }
}
