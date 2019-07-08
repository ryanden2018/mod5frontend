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
import apiurl from './apiurl';
//import 'whatwg-fetch'
//import 'promise-polyfill/src/polyfill';

class FileToolbar extends React.Component {

  state = { modal: null, errMsg: "" };

  setError = msg => {
    this.setState({modal:"error",errMsg:msg});
  }




  inviteToRoom = (inputVal) => {
    this.setState({modal:null});
    let username = this.props.alphanumericFilter(inputVal);
    if(username) {
      fetch(`${apiurl}/api/UserRooms`, {method:"POST",
        headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.token}`},
        credentials:'include',
        body: JSON.stringify( {recipientUsername: username, roomId: this.props.alphanumericFilter(this.props.roomProperties.id)} ) } )
      .catch( () => { this.setError("Could not invite user"); } );
    } else {
      this.setError("Could not invite user");
    }
  }

  deleteRoom = () => {
    this.setState({modal:null});
    fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(this.props.roomProperties.id)}`,{method:'DELETE',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
    .then( () => { 
      this.props.socket.emit("roomDeleted");
      this.props.resetFile();
      this.props.disposeAllFurnishings(true);
    } )
    .catch( () => { this.setError("Error deleting room") } )
  }

  render() {
    return ( 
      <>
      {
        this.state.modal === "new"
        ?
        <NewModal okCallback={(roomName,roomSize) => {this.setState({modal:null});this.props.newRoom(roomName,roomSize);}} cancelCallback={() => this.setState({modal:null})} />
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
        <OpenModal alphanumericFilter={this.props.alphanumericFilter} availableRooms={this.props.availableRooms || {}} okCallback={(inputVal) => {this.setState({modal:null});this.props.openRoom(inputVal);}} cancelCallback={() => this.setState({modal:null})} />
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
    addFurnishingFromObject: (obj,colors,renderer,camera,scene) => dispatch( {type:"ADD_FURNISHING_FROM_OBJECT",obj:obj,colors:colors,renderer:renderer,camera:camera,scene:scene} ),
    setIsOwner: (val) => dispatch({type:"SET_IS_OWNER",val:val}),
    setRoomProperties: (roomProperties) => dispatch({type:"SET_ROOM_PROPERTIES",roomProperties:roomProperties}),
    removeAllFurnishings: () => dispatch({type:"REMOVE_ALL_FURNISHINGS"}),
    resetFile: () => dispatch({type:"RESET_FILE"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileToolbar);
