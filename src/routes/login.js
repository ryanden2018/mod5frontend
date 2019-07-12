import React from 'react';
import FormButton from '../components/formbutton';
import '../App.css';
import apiurl from '../constants/apiurl';
import SafariModal from '../modals/safarimodal';

export default class Login extends React.Component {

  state = { err: "", modal: null }


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
      <div style={{width:"80%",paddingLeft:"50px",paddingTop:"20px"}}>
        <FormButton value="Sign Up" handleSubmit={() => this.props.history.push("/signup")} />
        <form onSubmit={this.handleSubmit}>
          <p>Username: <input type="text" id="username" name="username" defaultValue="dummy" /></p>
          <p>Password: <input type="password" id="password" name="password" defaultValue="abcdef" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><button type="submit">Login</button></p>
        </form>
        <p><b>Dummy account:</b> username "dummy", password "abcdef" (without the quotes).</p>
      </div>
    );
  }
}
