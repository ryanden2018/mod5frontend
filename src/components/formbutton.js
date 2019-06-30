import React from 'react';
import '../App.css';

export default class FormButton extends React.Component {
  render() {
    return (
      <form style={{display:"inline"}} onSubmit={e => {e.preventDefault();this.props.handleSubmit(e);e.target.reset();}}>
        <button style={{...this.props.style, fontSize: "15pt"}} type="submit">{this.props.value}</button>
      </form>
    );
  }
}
