import React from 'react';
import '../App.css';
import FurnishingsToolbar from './furnishingstoolbar';
import FileToolbar from './filetoolbar';
import MainCanvas from './maincanvas';
import { connect } from 'react-redux';
const io = require("socket.io-client");

const wsloc = "ws://localhost:8000";

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
          });
        fetch(`/api/users/${username}/rooms`)
        .then( res => res.json() )
        .then( rooms => {
          this.props.setAvailableRooms(rooms)
        }).catch( () => { } )
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

  handleLogout = () => {
    fetch(`/api/login`, {method:'DELETE'});
    this.props.history.push("/");
  }

  render() {
    return ( 
    <div>
      <p>Hello, {this.state.username}!</p>
      <form onSubmit={this.handleLogout}><input type="submit" value="Logout" /></form>
      <FileToolbar username={this.state.username} colors={this.state.colors} socket={this.state.socket} />
      {!!this.props.roomProperties ? <FurnishingsToolbar socket={this.state.socket} colors={this.state.colors} username={this.state.username} /> : null }
      {!!this.props.roomProperties ? <MainCanvas username={this.state.username} colors={this.state.colors} socket={this.state.socket} /> : null }
    </div> );
  }
}



const mapStateToProps = state => {
  return {
    roomProperties: state.file.roomProperties
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishingFromObject: (obj,colors) => dispatch( {type:"addFurnishingFromObject",obj:obj,colors:colors} ),
    setAvailableRooms: rooms => dispatch( {type:"setAvailableRooms",rooms:rooms})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Main);