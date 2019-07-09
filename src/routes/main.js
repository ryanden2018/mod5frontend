import React from 'react';
import '../App.css';
import HelpModal from '../modals/helpmodal';
import MainCanvas from '../components/maincanvas';
import { connect } from 'react-redux';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountBox from '@material-ui/icons/AccountBox';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import apiurl from '../constants/apiurl';

const io = require("socket.io-client");
const wsloc = ( (!window.location.href.includes("localhost")) ? "wss://ryanmod5backend.herokuapp.com" : "ws://localhost:8000" );

class Main extends React.Component {

  state = { username:"", socket:null, colors:{}, errMsg: null, modal: null };

  setErrMsg = msg => {
    this.setState({errMsg: msg});
  }

  componentDidMount() {
    fetch(`${apiurl}/api/colors`,{method:'GET',credentials:'include'})
    .then( res => res.json() )
    .then( data => {
      data.forEach( color => {
        let newColors = {...this.state.colors};
        newColors[color.name] = {red: color.red, green: color.green, blue: color.blue};
        this.setState({colors: newColors});
      });

      fetch(`${apiurl}/api/loggedin`,{method:'GET',credentials:'include'})
      .then( res => res.json() )
      .then( data => {
        if(data.status && (data.status.includes('Logged in as '))) {
          var username = this.props.alphanumericFilter(data.status.split(" ")[3]);
          this.setState({username:username}, () =>
            this.setState({socket: io(wsloc,{transports:['websocket']}) })
          );
          fetch(`${apiurl}/api/users/${this.props.alphanumericFilter(username)}/rooms`,{method:'GET',credentials:'include'})
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
    fetch(`${apiurl}/api/login`, {method:'DELETE',credentials:'include'})
    .then( () => this.props.history.push("/"));
  }

  openHelp = () => {
    this.setState({modal:"help"});
  }

  render() {
    return ( 
      <>
      {
        (this.state.modal === "help")
        ?
        <HelpModal okCallback={() => this.setState({modal:null})} />
        :
        null
      }
    <div>
      
      <div style={{width:"100%",paddingLeft:"50px"}}>
    { this.state.errMsg ? <p style={{color:"red"}}><b>{this.state.errMsg}</b></p> : <p>&nbsp;</p> }
        <form style={{display:"inline"}} onSubmit={this.handleLogout}><button type="submit" title="Logout"><SvgIcon><DirectionsWalk /></SvgIcon></button></form>
        <form style={{display:"inline"}} onSubmit={() => this.props.history.push("/manageAccount")}><button type="submit" title="Manage Account"><SvgIcon><AccountBox /></SvgIcon></button></form>
      
        
        { (!!this.state.socket) ? <MainCanvas history={this.props.history} openHelp={this.openHelp} setErrMsg={this.setErrMsg} alphanumericReplace={this.props.alphanumericReplace} alphanumericFilter={this.props.alphanumericFilter} username={this.state.username} colors={this.state.colors} socket={this.state.socket} /> : null }
      </div>
    </div>
    </> );
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