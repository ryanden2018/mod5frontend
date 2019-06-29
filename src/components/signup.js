import React from 'react';
import '../App.css';

export default class Signup extends React.Component {

  state = { err: "" }

  componentDidMount() {
    fetch("/api/loggedin")
    .then( res => res.json() )
    .then( data => {
      if(data.status.includes("Logged in as ")) {
        this.props.history.push("/main");
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;

    fetch(`/api/${username}/exists`)
    .then(res=>res.json())
    .then( data => {
      if(data.status === "user exists") {
        this.setState({err:"Username already taken"})
      } else {
        if(password !== confirmPassword) {
          this.setState({err: "Passwords must match"});
        } else {
          fetch(`/api/users`,{method:"POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({ username:username, password: password })
          }).then(res=>res.json())
          .then( response => {
            if(response.success) {
              fetch(`/api/login`, {method:"POST",
                headers:{"Content-type":"application/json"},
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" /></p>
          <p>Password: <input type="password" id="password" /></p>
          <p>Confirm Password: <input type="password" id="confirmPassword" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><input type="submit" value="Submit" /></p>
        </form>
      </div>
    );
  }
}
