import React from 'react';
import '../App.css';
import Toolbar from './toolbar';
import MainCanvas from './maincanvas';
import { connect } from 'react-redux';
const io = require("socket.io-client");

const wsloc = "ws://localhost:8000";

class Main extends React.Component {

  state = {username:"",socket:null};

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
              this.props.addFurnishingFromObject(payload.furnishing)
            });
          });
      } else {
        this.props.history.push("/");
      }
    });
  }

  handleLogout = () => {
    fetch(`/api/login`, {method:'DELETE'});
    this.props.history.push("/");
  }

  render() {
    return ( 
    <div>
      <p>Hello, {this.state.username}!</p>
      <form onSubmit={this.handleLogout}><input type="submit" value="Logout" /></form>
      <Toolbar socket={this.state.socket} />
      <MainCanvas username={this.state.username} socket={this.state.socket} />
    </div> );
  }
}



const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishingFromObject: (obj) => dispatch( {type:"addFurnishingFromObject",obj:obj} )
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Main);