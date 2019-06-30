import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Signup from './components/signup';
import Main from './components/main';
import Login from './components/login';
import ManageAccount from './components/manageAccount';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" render={(props) => <Login {...props} />} />
        <Route exact path="/signup" render={(props) => <Signup {...props} />} />
        <Route exact path="/main" render={(props) => <Main {...props} />} />
        <Route exact path="/manageAccount" render={(props) => <ManageAccount {...props} />} />
      </Router>
    );
  }
}
