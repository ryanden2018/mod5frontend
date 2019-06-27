import React from 'react';
import '../App.css';
import Toolbar from './toolbar';
import MainCanvas from './maincanvas';

export default class Main extends React.Component {

  state = {username:""};

  componentDidMount() {
    fetch(`/api/loggedin`)
    .then( res => res.json() )
    .then( data => {
      if(data.status && (data.status.includes('Logged in as '))) {
        var username = data.status.split(" ")[3];
        this.setState({username:username});
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
      <Toolbar />
      <MainCanvas username={this.state.username} />
    </div> );
  }
}
