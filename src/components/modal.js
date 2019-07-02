import React from 'react';
import '../App.css';

export default class Modal extends React.Component {

  constructor() {
    super();
    this.style = {position:'absolute',margin:'auto',left:"200px",top:"200px",width:'400px',backgroundColor:'white',borderStyle:'solid',zIndex:1};
  }

  render() {
    return (
      <div></div>
    );
  }
}
