import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import apiurl from './apiurl';
//import 'whatwg-fetch'
//import 'promise-polyfill/src/polyfill';

export default class Signup extends React.Component {

  state = { err: "" }

  componentDidMount() {
    fetch(`${apiurl}/api/loggedin`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
    .then( res => res.json() )
    .then( data => {
      if(data.status.includes("Logged in as ")) {
        this.props.history.push("/main");
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let username = this.props.alphanumericFilter(document.querySelector("#username").value);
    let password = this.props.alphanumericFilter(document.querySelector("#password").value);
    let confirmPassword = this.props.alphanumericFilter(document.querySelector("#confirmPassword").value);

    if( (!username) || (!password) || (!confirmPassword) ) {
      this.setState({err:"Username and password must be alphanumeric."})
      return;
    }

    fetch(`${apiurl}/api/${username}/exists`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
    .then(res=>res.json())
    .then( data => {
      if(data.status === "user exists") {
        this.setState({err:"Username already taken"})
      } else {
        if(password !== confirmPassword) {
          this.setState({err: "Passwords must match"});
        } else {
          fetch(`${apiurl}/api/users`,{method:"POST",
            headers: {"Content-type":"application/json","Authorization":`Bearer ${localStorage.token}`},
            credentials:'include',
            body: JSON.stringify({ username:username, password: password })
          }).then(res=>res.json())
          .then( response => {
            if(response.success) {
              fetch(`${apiurl}/api/login`, {method:"POST",
                headers:{"Content-type":"application/json","Authorization":`Bearer ${localStorage.token}`},
                credentials:'include',
                body:JSON.stringify({username:username,password:password})
              }).then(
                () => this.props.history.push("/main")
              );
            } else {
              this.setState({err:"Could not create user"});
            }
          });
        }
      }
    });

  }

  render() {
    return (
      <div style={{width:"100%",paddingLeft:"50px",paddingTop:"20px"}}>
        <FormButton value="Return to Login" handleSubmit={() => this.props.history.push("/")} />
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" /></p>
          <p>Password: <input type="password" id="password" /></p>
          <p>Confirm Password: <input type="password" id="confirmPassword" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><button type="submit">Submit</button></p>
        </form>
      </div>
    );
  }
}
