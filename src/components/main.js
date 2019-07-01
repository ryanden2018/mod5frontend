import React from 'react';
import '../App.css';
import FurnishingsToolbar from './furnishingstoolbar';
import FileToolbar from './filetoolbar';
import ModeToolbar from './modetoolbar';
import MainCanvas from './maincanvas';
import { connect } from 'react-redux';
const io = require("socket.io-client");

const wsloc = "ws://10.185.5.190:8000";

class Main extends React.Component {

  state = { username:"", socket:null, colors:{} };

  componentDidMount() {
    fetch(`/api/loggedin`)
    .then( res => res.json() )
    .then( data => {
      if(data.status && (data.status.includes('Logged in as '))) {
        var username = data.status.split(" ")[3];
        this.setState({username:username});
        this.setState({socket: io(wsloc,{transports:['websocket']}) },
          () => {
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
        fetch(`/api/users/${username}/rooms`)
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
      <p>Hello, {this.state.username}!</p>
      <form style={{display:"inline"}} onSubmit={this.handleLogout}><button type="submit" style={{fontSize:"15pt"}}>Logout</button></form>
      <form style={{display:"inline"}} onSubmit={() => this.props.history.push("/manageAccount")}><button type="submit" style={{fontSize:"15pt"}}>Manage Account</button></form>
      <FileToolbar username={this.state.username} colors={this.state.colors} socket={this.state.socket} />
      {!!this.props.roomProperties ? <ModeToolbar socket={this.state.socket} colors={this.state.colors} useranme={this.state.username} /> : null }
      {!!this.props.roomProperties ? <FurnishingsToolbar socket={this.state.socket} colors={this.state.colors} username={this.state.username} /> : null }
      {!!this.props.roomProperties ? <MainCanvas username={this.state.username} colors={this.state.colors} socket={this.state.socket} /> : null }
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
    roomLogout : () => dispatch({type:"ROOM_LOGOUT"})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Main);