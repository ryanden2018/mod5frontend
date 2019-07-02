import React from 'react';
import '../App.css';

export default class FormButton extends React.Component {
  render() {
    let setColor = true;
    if(this.props.style && (this.props.style.backgroundColor === "yellow")) {
      setColor = false;
    }
    return (
      <form style={{display:"inline"}} onSubmit={e => {e.preventDefault();this.props.handleSubmit(e);e.target.reset();}}>
        <button style={{...this.props.style, backgroundColor: ( setColor ? "#ff9d00" : this.props.style.backgroundColor ), boxShadow: "1px 1px 2px gray", fontSize: "15pt", paddingLeft:"10px",paddingRight:"10px",margin:"2px", borderRadius:"20px", borderStyle:"none"}} type="submit">{this.props.value}</button>
      </form>
    );
  }
}
