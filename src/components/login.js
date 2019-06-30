import React from 'react';
import FormButton from './formbutton';
import '../App.css';

export default class Login extends React.Component {

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
    fetch(`/api/login`, {method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:username,password:password})
    }).then( res => res.json() )
    .then( data => {
      if(data.success) {
        this.props.history.push("/main");
      } else {
        this.setState({err:"Could not log in"});
      }
    });
  }


  render() {
    return ( 
      <div>
        <FormButton value="Sign Up" handleSubmit={() => this.props.history.push("/signup")} />
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" /></p>
          <p>Password: <input type="password" id="password" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><input type="submit" value="Submit" /></p>
        </form>
      </div>
    );
  }
}
