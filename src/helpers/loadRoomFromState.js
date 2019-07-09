export default function loadRoomFromState(state) {
  this.disposeAllFurnishings(true);
  this.rebuildRoom();
  state.forEach( furnishing => {
    this.props.addFurnishingFromObject(furnishing,this.props.colors,this.renderer,this.camera,this.scene);
  });
}
