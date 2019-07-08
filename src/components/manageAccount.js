import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import ConfirmModal from './confirmmodal';
import apiurl from './apiurl';
//import 'whatwg-fetch'
//import 'promise-polyfill/src/polyfill';

export default class ManageAccount extends React.Component {

  state = { err: "", modal: null,deleteUsername:"" }

  componentDidMount() {
    fetch(`${apiurl}/api/loggedin`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
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
      fetch(`${apiurl}/api/users/${username}/password`,{method:"PATCH",
        headers: {"Content-type":"application/json","Authorization":`Bearer ${localStorage.token}`},
        credentials:'include',
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

  deleteAccount = () => {
    let username = this.props.alphanumericFilter(this.state.deleteUsername);
    if( username )
    {
      fetch(`${apiurl}/api/users/${username}`,{method:"DELETE",headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
      .then( () => 
        fetch(`${apiurl}/api/login`, {method:'DELETE',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
        .then( () => {
          localStorage.setItem("token","");
          this.props.history.push("/") 
        }) 
      );
    }
  }

  handleDelete = e => {
    let name = document.querySelector('#deleteUsername').value;
    e.preventDefault();
    e.target.reset();
    this.setState({modal:"delete",deleteUsername:name}) 
  }

  render() {
    return (
      <>
      {
        (this.state.modal === "delete")
        ?
        <ConfirmModal message={"Permanently delete this account?"} cancelCallback={() => this.setState({modal:null})} okCallback={() => {this.setState({modal:null});this.deleteAccount();}} />
        :
        null
      }
      <div style={{width:"100%",paddingLeft:"50px",paddingTop:"20px"}}>
        <FormButton value="Return to Main" handleSubmit={() => this.props.history.push("/main")} />
        <h2>Change Password</h2>
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" /></p>
          <p>Old Password: <input type="password" id="oldPassword" /></p>
          <p>New Password: <input type="password" id="password" /></p>
          <p>Confirm New Password: <input type="password" id="confirmPassword" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><button type="submit">Submit</button></p>
        </form>
        <h2>Delete Account</h2>
        <form onSubmit={this.handleDelete}>
          <p>Enter Username: <input type="text" id="deleteUsername" /></p>
          <p><button type="submit">Delete Account</button></p>
        </form>
      </div>
      </>
    );
  }
}
