import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';

class FileToolbar extends React.Component {

  newRoom() {
    if(!this.props.roomProperties || window.confirm("Are you sure you want to create a new room?")) {
      let name = this.props.alphanumericFilter(window.prompt("New room name (must be alphanumeric, no spaces)"))
      let size = this.props.alphanumericFilter(window.prompt("Size from 1 to 10"))
      if(name && size && size.match(/^\d+$/) && (parseInt(size)>0) && (parseInt(size)<11)) {
        fetch(`/api/rooms`, { method:"POST",
          headers: {"Content-type":"application/json"},
          body: JSON.stringify( {room:{name:name,length:parseInt(size)+3,width:parseInt(size)+3,height:4}} ) }
        ).then( res => res.json() )
        .then( data => {
          if(!data.error) {
            this.props.setIsOwner(true);
            this.props.setRoomProperties(data);
            this.props.removeAllFurnishings();
            this.props.socket.emit("join",{roomId:data.id});
          } else {
            window.alert("Could not create room");
          }
        })
        .catch( () => window.alert("Could not create room") );
      } else {
        window.alert("Could not create room");
      }
    }
  }

  openRoom = () => {
    let roomId = parseInt(document.querySelector("#openSelect").value);
    if(roomId !== -1) {
      if(!this.props.roomProperties || window.confirm("Are you sure you want to open this room?")) {
        fetch(`/api/rooms/${this.props.alphanumericFilter(roomId)}`)
        .then( res => res.json() )
        .then( room => {
          this.props.setRoomProperties(room);
          fetch(`/api/rooms/${this.props.alphanumericFilter(roomId)}/furnishings`)
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

              fetch(`/api/rooms/${this.props.alphanumericFilter(roomId)}/isOwner`)
              .then(res=>res.json())
              .then( results => {
                if(results.status) {
                  this.props.setIsOwner(true);
                } else {
                  this.props.setIsOwner(false);
                }
              }).catch( () => { } );


            } else {
              window.alert("Could not open room")
            } 
          }).catch( () => window.alert("Could not open room") );
        }).catch( () => window.alert("Could not open room") );
      }
    }
  }


  inviteToRoom = () => {
    let username = this.props.alphanumericFilter(window.prompt("Enter username of user to invite"));
    if(username) {
      fetch(`/api/UserRooms`, {method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify( {recipientUsername: username, roomId: this.props.alphanumericFilter(this.props.roomProperties.id)} ) } )
      .catch( () => { } );
    }
  }

  deleteRoom = () => {
    fetch(`/api/rooms/${this.props.alphanumericFilter(this.props.roomProperties.id)}`,{method:'DELETE'})
    .then( () => { 
      this.props.socket.emit("roomDeleted");
      this.props.resetFile();
      this.props.removeAllFurnishings();
    } )
    .catch( () => { } )
  }

  render() {
    return ( 
    <div>
      <FormButton value="New" handleSubmit={() => this.newRoom()} />
      { this.props.availableRooms 
       ? 
         <select id="openSelect" onChange={e => e.preventDefault()}>
           <option value="-1">Select a room...</option>
           {
             Object.keys(this.props.availableRooms).map(
               key => {
                 let room = this.props.availableRooms[key]
                 return ( <option value={this.props.alphanumericFilter(room.id)}>{this.props.alphanumericFilter(room.name)}</option> );
               }
             )
           }
         </select>
       : null }
      { this.props.availableRooms ? <FormButton value="Open" handleSubmit={() => this.openRoom()} /> : null }
      { this.props.roomProperties && this.props.amOwner ? <FormButton value="Invite" handleSubmit={() => this.inviteToRoom()} /> : null }
      { this.props.roomProperties ? <b>Current Room: {this.props.alphanumericFilter(this.props.roomProperties.name)}</b> : null } 
      { this.props.roomProperties && this.props.amOwner ? <FormButton value="Delete Room" handleSubmit={() => this.deleteRoom()} /> : null }
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
    addFurnishingFromObject: (obj,colors) => dispatch( {type:"ADD_FURNISHING_FROM_OBJECT",obj:obj,colors:colors} ),
    setIsOwner: (val) => dispatch({type:"SET_IS_OWNER",val:val}),
    setRoomProperties: (roomProperties) => dispatch({type:"SET_ROOM_PROPERTIES",roomProperties:roomProperties}),
    removeAllFurnishings: () => dispatch({type:"REMOVE_ALL_FURNISHINGS"}),
    resetFile: () => dispatch({type:"RESET_FILE"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileToolbar);
