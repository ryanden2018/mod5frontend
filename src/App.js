import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Signup from './components/signup';
import Main from './components/main';
import Login from './components/login';
import ManageAccount from './components/manageAccount';

export default class App extends React.Component {

  // return string if string is alphanumeric, null otherwise
  // allowSpaces : allow spaces if true, default false
  alphanumericFilter = (string, allowSpaces = false) => {
    var match = ( allowSpaces ? /^[a-zA-Z0-9 ]*$/ : /^[a-zA-Z0-9]*$/ );
    if( string && string.toString && string.toString().match(match) ) {
      return string;
    } else {
      return null;
    }
  }

  render() {
    return (
      <Router>
        <Route exact path="/" render={(props) => <Login {...props} alphanumericFilter={this.alphanumericFilter} />} />
        <Route exact path="/signup" render={(props) => <Signup {...props} alphanumericFilter={this.alphanumericFilter} />} />
        <Route exact path="/main" render={(props) => <Main {...props} alphanumericFilter={this.alphanumericFilter} />}  />
        <Route exact path="/manageAccount" render={(props) => <ManageAccount {...props} alphanumericFilter={this.alphanumericFilter}  />} />
      </Router>
    );
  }
}
