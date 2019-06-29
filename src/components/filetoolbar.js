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
            this.props.socket.emit("join",{roomId:data.id});
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

              fetch(`/api/rooms/${roomId}/isOwner`)
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
    let username = window.prompt("Enter username of user to invite");
    if(username) {
      fetch(`/api/UserRooms`, {method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify( {recipientUsername: username, roomId: this.props.roomProperties.id} ) } )
      .catch( () => { } );
    }
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
    addFurnishingFromObject: (obj,colors) => dispatch( {type:"ADD_FURNISHING_FROM_OBJECT",obj:obj,colors:colors} ),
    setIsOwner: (val) => dispatch({type:"SET_IS_OWNER",val:val}),
    setRoomProperties: (roomProperties) => dispatch({type:"SET_ROOM_PROPERTIES",roomProperties:roomProperties}),
    removeAllFurnishings: () => dispatch({type:"REMOVE_ALL_FURNISHINGS"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileToolbar);
