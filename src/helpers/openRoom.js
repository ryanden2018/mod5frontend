import apiurl from '../constants/apiurl';

export default function openRoom(inputVal) {
  let roomId = parseInt(inputVal);
  if(roomId !== -1) {
    fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}`,{method:'GET',credentials:'include'})
    .then( res => res.json() )
    .then( room => {
      this.props.setRoomProperties(room);
      this.rebuildRoom();
      fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}/furnishings`,{method:'GET',credentials:'include'})
      .then(res => res.json() )
      .then( furnishings => {
        if(!furnishings.error) {
          this.props.clearUndoStack();
          this.props.clearRedoStack();
          this.props.removeAllFurnishings();
          Object.keys(furnishings).forEach(
            key => {
              this.props.addFurnishingFromObject(furnishings[key],this.props.colors,this.renderer,this.camera,this.scene);
            }
          );
          this.props.socket.emit("join",{roomId:roomId});

          fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}/isOwner`,{method:'GET',credentials:'include'})
          .then(res=>res.json())
          .then( results => {
            if(results.status) {
              this.props.setIsOwner(true);
            } else {
              this.props.setIsOwner(false);
            }
          }).catch( () => { } );

          this.props.setErrMsg("");
          this.setState({roomId: roomId});


        } else {
          this.props.setErrMsg("Could not open room");
          this.disposeAllFurnishings(true);
          this.props.resetEverything();
        } 
      }).catch( () => {
        this.props.setErrMsg("Could not open room");
        this.disposeAllFurnishings(true);
        this.props.resetEverything();
      });
    }).catch( () => {
       this.props.setErrMsg("Could not open room");
       this.disposeAllFurnishings(true);
       this.props.resetEverything();
    });
  
  }
}
