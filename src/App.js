import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Signup from './components/signup';
import Main from './components/main';
import Login from './components/login';
//const io = require("socket.io-client")
//var socket;
//socket = io("ws://localhost:8000",{transports:['websocket']});

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" render={(props) => <Login {...props} />} />
        <Route exact path="/signup" render={(props) => <Signup {...props} />} />
        <Route exact path="/main" render={(props) => <Main {...props} />} />
      </Router>
    );
  }
}
