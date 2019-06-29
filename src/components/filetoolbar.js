import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';

class FileToolbar extends React.Component {

  newRoom() {
    if(!this.props.roomProperties || window.confirm("Are you sure you want to create a new room?")) {
      let name = window.prompt("New room name")
      if(name) {
        fetch(`/api/rooms`, { method:"POST",
          headers: {"Content-type":"application/json"},
          body: JSON.stringify( {room:{name:name,length:20,width:20,height:10}} ) }
        ).then( res => res.json() )
        .then( data => {
          if(!data.error) {
            this.props.setIsOwner(true);
            this.props.setRoomProperties(data);
            this.props.removeAllFurnishings();
          } else {
            window.alert("Could not create room");
          }
        })
        .catch( () => window.alert("Could not create room") );
      }
    }
  }

  openRoom = () => {
    let roomId = parseInt(document.querySelector("#openSelect").value);
    if(roomId !== -1) {
      if(!this.props.roomProperties || window.confirm("Are you sure you want to open this room?")) {
        fetch(`/api/rooms/${roomId}`)
        .then( res => res.json() )
        .then( room => {
          this.props.setRoomProperties(room);
          fetch(`/api/rooms/${roomId}/furnishings`)
          .then(res => res.json() )
          .then( furnishings => {
            if(!furnishings.error) {
              this.props.removeAllFurnishings();
              Object.keys(furnishings).forEach(
                key => {
                  this.props.addFurnishingFromObject(furnishings[key],this.props.colors);
                }
              );
              this.props.socket.emit("join",{roomId:roomId});
            } else {
              window.alert("Could not open room")
            } 
          }).catch( () => window.alert("Could not open room") );
        }).catch( () => window.alert("Could not open room") );
      }
    }
  }


  inviteToRoom = () => {
  }

  render() {
    return ( 
    <div>
      <FormButton value="New" handleSubmit={() => this.newRoom()} />
      { this.props.availableRooms 
       ? 
         <select id="openSelect">
           <option value="-1">Select a room...</option>
           {
             Object.keys(this.props.availableRooms).map(
               key => {
                 let room = this.props.availableRooms[key]
                 return ( <option value={room.id}>{room.name}</option> );
               }
             )
           }
         </select>
       : null }
      { this.props.availableRooms ? <FormButton value="Open" handleSubmit={() => this.openRoom()} /> : null }
      { this.props.roomProperties && this.props.amOwner ? <FormButton value="Invite" handleSubmit={() => this.inviteToRoom()} /> : null }
      { this.props.roomProperties ? <b>Current Room: {this.props.roomProperties.name}</b> : null } 
    </div> );
  }
}

const mapStateToProps = state => {
  return {
    amOwner: state.file.amOwner,
    roomProperties: state.file.roomProperties,
    availableRooms: state.file.availableRooms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishingFromObject: (obj,colors) => dispatch( {type:"addFurnishingFromObject",obj:obj,colors:colors} ),
    setIsOwner: (val) => dispatch({type:"setIsOwner",val:val}),
    setRoomProperties: (roomProperties) => dispatch({type:"setRoomProperties",roomProperties:roomProperties}),
    removeAllFurnishings: () => dispatch({type:"removeAllFurnishings"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileToolbar);
