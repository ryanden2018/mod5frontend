import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';
import NewModal from './newmodal';
import ErrorModal from './errormodal';
import OpenModal from './openmodal';
import InviteModal from './invitemodal';
import ConfirmModal from './confirmmodal';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import FolderOpen from '@material-ui/icons/FolderOpen';
import PersonAdd from '@material-ui/icons/PersonAdd';

class FileToolbar extends React.Component {

  state = { modal: null, errMsg: "" };

  setError = msg => {
    this.setState({modal:"error",errMsg:msg});
  }

  newRoom = (roomName,roomSize) => {
    this.setState({modal:null});
    let name = this.props.alphanumericFilter(roomName)
    let size = this.props.alphanumericFilter(roomSize)
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
          this.setError("Could not create room");
        }
      })
      .catch( () => this.setError("Could not create room") );
    } else {
      this.setError("Could not create room");
    }
  }

  openRoom = (inputVal) => {
    this.setState({modal:null});
    let roomId = parseInt(inputVal);
    if(roomId !== -1) {
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
            this.setError("Could not open room")
          } 
        }).catch( () => this.setError("Could not open room") );
      }).catch( () => this.setError("Could not open room") );
    
    }
  }


  inviteToRoom = (inputVal) => {
    this.setState({modal:null});
    let username = this.props.alphanumericFilter(inputVal);
    if(username) {
      fetch(`/api/UserRooms`, {method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify( {recipientUsername: username, roomId: this.props.alphanumericFilter(this.props.roomProperties.id)} ) } )
      .catch( () => { this.setError("Could not invite user"); } );
    } else {
      this.setError("Could not invite user");
    }
  }

  deleteRoom = () => {
    this.setState({modal:null});
    fetch(`/api/rooms/${this.props.alphanumericFilter(this.props.roomProperties.id)}`,{method:'DELETE'})
    .then( () => { 
      this.props.socket.emit("roomDeleted");
      this.props.resetFile();
      this.props.removeAllFurnishings();
    } )
    .catch( () => { this.setError("Error deleting room") } )
  }

  render() {
    return ( 
      <>
      {
        this.state.modal === "new"
        ?
        <NewModal okCallback={this.newRoom} cancelCallback={() => this.setState({modal:null})} />
        :
        null
      }
      {
        this.state.modal === "error"
        ?
        <ErrorModal message={this.state.errMsg} callback={() => this.setState({modal:null})} />
        :
        null
      }
      {
        this.state.modal === "open"
        ?
        <OpenModal alphanumericFilter={this.props.alphanumericFilter} availableRooms={this.props.availableRooms || {}} okCallback={this.openRoom} cancelCallback={() => this.setState({modal:null})} />
        :
        null
      }
      {
        this.state.modal === "invite"
        ?
        <InviteModal okCallback={this.inviteToRoom} cancelCallback={() => this.setState({modal:null})} />
        :
        null
      }
      {
        this.state.modal === "delete"
        ?
        <ConfirmModal message={"Permanently delete this room?"} cancelCallback={() => this.setState({modal:null})} okCallback={() => this.deleteRoom()} />
        :
        null
      }
    <span>
      <FormButton value="New" icon={<Create />} handleSubmit={() => this.setState({modal:"new"})} />
      
      { this.props.availableRooms ? <FormButton value="Open" icon={<FolderOpen />} handleSubmit={() => this.setState({modal:"open"})} /> : null }
      { this.props.roomProperties && this.props.amOwner ? <FormButton value="Invite" icon={<PersonAdd />} handleSubmit={() => this.setState({modal:"invite"})} /> : null }
      { this.props.roomProperties && this.props.amOwner ? <FormButton value="Delete Room" icon={<DeleteForever />} handleSubmit={() => this.setState({modal:"delete"})} /> : null }
      { this.props.roomProperties ? <b>Current Room: {this.props.alphanumericFilter(this.props.roomProperties.name)}</b> : null } 
    </span>
    </> );
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
