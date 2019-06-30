import React from 'react';
import '../App.css';
import FormButton from './formbutton';

export default class ManageAccount extends React.Component {

  state = { err: "" }

  componentDidMount() {
    fetch("/api/loggedin")
    .then( res => res.json() )
    .then( data => {
      if(!data.status.includes("Logged in as ")) {
        this.props.history.push("/");
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let oldPassword = document.querySelector("#oldPassword").value;
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;

    if(password !== confirmPassword) {
      this.setState({err: "New passwords must match"});
    } else {
      fetch(`/api/users/${username}/password`,{method:"PATCH",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify({ currentPassword:oldPassword, newPassword: password })
      }).then(res=>res.json())
      .then( response => {
        if(response.success) {
          this.props.history.push("/main");
        } else {
          this.setState({err:"Could not create user"});
        }
      });
    }

  }

  deleteAccount = (event) => {
    event.preventDefault();
    let username = document.querySelector('#deleteUsername').value;
    if( window.confirm("Are you sure you want to permanently delete this account?") )
    {
      fetch(`/api/users/${username}`,{method:"DELETE"})
      .then( () => 
        fetch(`/api/login`, {method:'DELETE'})
        .then( () => this.props.history.push("/") ) );
    }
  }

  render() {
    return (
      <div>
        <FormButton value="Return to Main" handleSubmit={() => this.props.history.push("/main")} />
        <h2>Change Password</h2>
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" /></p>
          <p>Old Password: <input type="password" id="oldPassword" /></p>
          <p>New Password: <input type="password" id="password" /></p>
          <p>Confirm New Password: <input type="password" id="confirmPassword" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><input type="submit" value="Submit" /></p>
        </form>
        <h2>Delete Account</h2>
        <form onSubmit={this.deleteAccount}>
          <p>Enter Username: <input type="text" id="deleteUsername" /></p>
          <p><button type="submit">Delete Account</button></p>
        </form>
      </div>
    );
  }
}
