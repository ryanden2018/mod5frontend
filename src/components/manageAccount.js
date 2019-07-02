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
    let username = this.props.alphanumericFilter(document.querySelector("#username").value);
    let oldPassword = this.props.alphanumericFilter(document.querySelector("#oldPassword").value);
    let password = this.props.alphanumericFilter(document.querySelector("#password").value);
    let confirmPassword = this.props.alphanumericFilter(document.querySelector("#confirmPassword").value);

    if( (!username) || (!oldPassword) || (!password) || (!confirmPassword) ) {
      this.setState({err:"Username and password must be alphanumeric."});
      return;
    }

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
    let username = this.props.alphanumericFilter(document.querySelector('#deleteUsername').value);
    if( username && window.confirm("Are you sure you want to permanently delete this account?") )
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
          <p><button type="submit" style={{fontSize:"15pt"}}>Submit</button></p>
        </form>
        <h2>Delete Account</h2>
        <form onSubmit={this.deleteAccount}>
          <p>Enter Username: <input type="text" id="deleteUsername" /></p>
          <p><button type="submit" style={{fontSize:"15pt"}}>Delete Account</button></p>
        </form>
      </div>
    );
  }
}
