import React from 'react';
import '../App.css';

export default class Modal extends React.Component {

  constructor() {
    super();
    this.style = {boxShadow:"5px 5px 5px gray",position:'absolute',margin:'auto',left:"200px",top:"200px",width:'400px',backgroundColor:'white',borderStyle:'solid',zIndex:1,padding:"12px"};
  }

  render() {
    return (
      <div></div>
    );
  }
}
