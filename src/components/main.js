import React from 'react';
import '../App.css';
import FileToolbar from './filetoolbar';
import ModeToolbar from './modetoolbar';
import MainCanvas from './maincanvas';
import { connect } from 'react-redux';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountBox from '@material-ui/icons/AccountBox';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';

const io = require("socket.io-client");
const wsloc = "ws://localhost:8000";

class Main extends React.Component {

  state = { username:"", socket:null, colors:{}, errMsg: "" };

  componentDidMount() {
    fetch(`/api/loggedin`)
    .then( res => res.json() )
    .then( data => {
      if(data.status && (data.status.includes('Logged in as '))) {
        var username = this.props.alphanumericFilter(data.status.split(" ")[3]);
        this.setState({username:username});
        this.setState({socket: io(wsloc,{transports:['websocket']}) },
          () => {
            this.state.socket.on('disconnect', () => {
              this.setState({errMsg: "There is a problem with the connection."});
              this.props.resetEverything();
            });

            this.state.socket.on('roomDeleted',() => {
              this.setState({errMsg:"The room was deleted."});
              this.state.socket.emit("removeFromAllRooms");
              this.props.resetEverything();
            });

            this.state.socket.on("create",payload=>{
              this.props.addFurnishingFromObject(payload.furnishing,this.state.colors)
            });
            this.state.socket.on("lockResponse",payload=>{
              if(payload === "approved") {
                this.props.setLockApproved();
                this.props.brighten(this.props.lock.furnishingId,this.state.colors);
              } else {
                this.props.unLock();
              }
            });
            this.state.socket.on("update", payload => {
              this.props.addFurnishingFromObject(payload.furnishing,this.state.colors);
            });
            this.state.socket.on("delete", payload=>{
              this.props.deleteFurnishing(payload.furnishingId);
            });
            this.state.socket.on("colorUpdate",payload=>{
              this.props.updateColor(payload.furnishingId,payload.colorName,this.state.colors);
            });
            this.state.socket.on("availableRooms", payload => {
              this.props.setAvailableRooms(payload.availableRooms)
            });
          });
        fetch(`/api/users/${this.props.alphanumericFilter(username)}/rooms`)
        .then( res => res.json() )
        .then( rooms => {
          this.props.setAvailableRooms(rooms)
        }).catch( () => { } )
        this.roomsInterval = setInterval( () => {
          if(this.state.socket) {
            this.state.socket.emit("getAvailableRooms");
          }
        },5000);
      } else {
        this.props.history.push("/");
      }
    });

  

    fetch('/api/colors')
    .then( res => res.json() )
    .then( data => {
      data.forEach( color => {
        let newColors = {...this.state.colors};
        newColors[color.name] = {red: color.red, green: color.green, blue: color.blue};
        this.setState({colors: newColors});
      });
    }).catch( () => { } )
  }


  componentWillUnmount() {
    if(this.roomsInterval) {
      clearInterval(this.roomsInterval);
      this.roomsInterval = null;
    }
    if(this.state.socket && this.state.socket.emit) {
      this.state.socket.emit("removeFromAllRooms");
    }
  }


  handleLogout = (e) => {
    e.preventDefault();
    this.props.modeLogout();
    this.props.lockLogout();
    this.props.fileLogout();
    this.props.roomLogout();
    fetch(`/api/login`, {method:'DELETE'});
    this.props.history.push("/");
  }

  render() {
    return ( 
    <div>
      <p style={{color:"red"}}><b>{this.state.errMsg}</b></p>
      <div>
      <form style={{display:"inline"}} onSubmit={this.handleLogout}><button type="submit" title="Logout"><SvgIcon><DirectionsWalk /></SvgIcon></button></form>
      <form style={{display:"inline"}} onSubmit={() => this.props.history.push("/manageAccount")}><button type="submit" title="Manage Account"><SvgIcon><AccountBox /></SvgIcon></button></form>
      <FileToolbar alphanumericFilter={this.props.alphanumericFilter} username={this.state.username} colors={this.state.colors} socket={this.state.socket} />
      </div>
      
      {!!this.props.roomProperties ? <ModeToolbar alphanumericFilter={this.props.alphanumericFilter} socket={this.state.socket} colors={this.state.colors} useranme={this.state.username} /> : null }
      {!!this.props.roomProperties ? <MainCanvas alphanumericFilter={this.props.alphanumericFilter} username={this.state.username} colors={this.state.colors} socket={this.state.socket} /> : null }
    </div> );
  }
}



const mapStateToProps = state => {
  return {
    roomProperties: state.file.roomProperties,
    lock: state.lock
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishingFromObject: (obj,colors) => dispatch( {type:"ADD_FURNISHING_FROM_OBJECT",obj:obj,colors:colors} ),
    setAvailableRooms: rooms => dispatch( {type:"SET_AVAILABLE_ROOMS",rooms:rooms}),
    unLock : () => dispatch({type:"UN_LOCK"}),
    setLockApproved: () => dispatch({type:"SET_LOCK_APPROVED"}),
    brighten : (furnishingId, colors) => dispatch( { type:"BRIGHTEN", furnishingId:furnishingId, colors:colors } ),
    deleteFurnishing : (furnishingId) => dispatch({type:"DELETE_FURNISHING",furnishingId:furnishingId}),
    updateColor : (furnishingId,colorName,colors) => dispatch({type:"UPDATE_COLOR",furnishingId:furnishingId,colorName:colorName,colors:colors}),
    modeLogout : () => dispatch({type:"MODE_LOGOUT"}),
    lockLogout : () => dispatch({type:"LOCK_LOGOUT"}),
    fileLogout : () => dispatch({type:"FILE_LOGOUT"}),
    roomLogout : () => dispatch({type:"ROOM_LOGOUT"}),
    resetEverything : () => { dispatch({type:"REMOVE_ALL_FURNISHINGS"}); dispatch({type:"RESET_FILE"}); dispatch({type:"LOCK_LOGOUT"}); dispatch({type:"MODE_LOGOUT"}); }
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Main);