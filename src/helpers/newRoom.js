import apiurl from '../constants/apiurl';

export default function newRoom(roomName,roomSize) {
  let name = this.props.alphanumericReplace(roomName)
  let size = this.props.alphanumericReplace(roomSize)
  if(name && size && size.match(/^\d+$/) && (parseInt(size)>0) && (parseInt(size)<11)) {
    fetch(`${apiurl}/api/rooms`, { method:"POST",
      headers: {"Content-type":"application/json"},
      credentials:'include',
      body: JSON.stringify( {room:{name:name,length:parseInt(size)+3,width:parseInt(size)+3,height:4}} ) }
    ).then( res => res.json() )
    .then( data => {
      if(!data.error) {
        this.props.setIsOwner(true);
        this.props.setRoomProperties(data);
        this.rebuildRoom();
        this.props.socket.emit("join",{roomId:data.id});
        this.setState({roomId: data.id});
      } else {
        this.props.setErrMsg("Could not create room");
      }
    })
    .catch( () => this.props.setErrMsg("Could not create room") );
  } else {
    this.props.setErrMsg("Could not create room");
  }
}
