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
          <p>Username: <input type="text" id="username" name="username" value="dummy" /></p>
          <p>Password: <input type="password" id="password" name="password" value="abcdef" /></p>
          <p style={{color:"red"}}><b>{this.state.err}</b></p>
          <p><button type="submit">Login</button></p>
        </form>
        <p><b>Dummy account:</b> username "dummy", password "abcdef" (without the quotes).</p>
        <p><b>Safari users on MacOSX: </b> To use this site, you will need to 
        select <tt>Preferences</tt> from the <tt>Safari</tt> menu, click on 
        <tt>Privacy</tt>, and make sure that "Prevent cross-site tracking" is <b>not</b>
        selected. Then you will need to restart Safari (<tt>Safari &gt; Quit Safari</tt>).
        This is because the authentication process uses a cookie set from
        a secondary domain (which I control), and Safari usually prohibits such cookies
        for privacy reasons.</p>
        <p><b>Internet Explorer</b> is not supported; please use the latest version of Edge, Firefox or Chrome.</p>
      </div>
    );
  }
}
