import React from 'react';
import FormButton from '../components/formbutton';
import '../App.css';
import apiurl from '../constants/apiurl';

export default class Login extends React.Component {

  state = { err: "" }


  componentDidMount() {
    fetch(`${apiurl}/api/loggedin`,{
      method:'GET',
      credentials:'include'
    })
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
    if( (!username) || (!password) ) {
      this.setState({err:"Username and password must be alphanumeric."});
      return;
    }


    fetch(`${apiurl}/api/login`, {method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:username,password:password}),
      credentials: 'include'
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
      <div style={{width:"100%",paddingLeft:"50px",paddingTop:"20px"}}>
        <FormButton value="Sign Up" handleSubmit={() => this.props.history.push("/signup")} />
        <form onSubmit={this.handleSubmit}>
        {/*<form method="POST" action={`${apiurl}/api/login`}>*/}
          <p>Username: <input type="text" id="username" name="username" /></p>
          <p>Password: <input type="password" id="password" name="password" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><button type="submit">Login</button></p>
        </form>
        <p><b>Dummy account:</b> username "dummy", password "abcdef" (without the quotes)</p>
      </div>
    );
  }
}