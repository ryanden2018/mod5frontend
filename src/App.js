import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Signup from './routes/signup';
import Main from './routes/main';
import Login from './routes/login';
import NavBar from './components/navbar';
import ManageAccount from './routes/manageAccount';

export default class App extends React.Component {

  // return string if string is alphanumeric, null otherwise
  // allowSpaces : allow spaces if true, default false
  alphanumericFilter = (string, allowSpaces = false) => {
    var match = ( allowSpaces ? /^[a-zA-Z0-9 ]*$/ : /^[a-zA-Z0-9]*$/ );
    if( string && string.toString && string.toString().match(match) ) {
      return string.toString();
    } else {
      return null;
    }
  }

  // remove non-alphanumeric characters from string and return result
  alphanumericReplace = string => {
    if(string && string.toString) {
      return string.toString().replace(/[^a-zA-Z0-9]/g,"");
    } else {
      return null;
    }
  }

  render() {
    return (
      <Router>
        <NavBar />
        <Route exact path="/" render={(props) => <Login {...props} alphanumericFilter={this.alphanumericFilter} />} />
        <Route exact path="/signup" render={(props) => <Signup {...props} alphanumericFilter={this.alphanumericFilter} />} />
        <Route exact path="/main" render={(props) => <Main {...props} alphanumericReplace={this.alphanumericReplace} alphanumericFilter={this.alphanumericFilter} />}  />
        <Route exact path="/manageAccount" render={(props) => <ManageAccount {...props} alphanumericFilter={this.alphanumericFilter}  />} />
      </Router>
    );
  }
}
