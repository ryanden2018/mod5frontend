import React from 'react';
import '../App.css';
import SvgIcon from '@material-ui/core/SvgIcon';

export default class FormButton extends React.Component {
  render() {
    let setColor = true;
    if(this.props.style && (this.props.style.backgroundColor === "yellow")) {
      setColor = false;
    }
    return (
      <form style={{display:"inline"}} onSubmit={e => {e.preventDefault();this.props.handleSubmit(e);e.target.reset();}}>
        <button  title={this.props.value} style={{...this.props.style, backgroundColor: ( setColor ? "#ff9d00" : this.props.style.backgroundColor )}} type="submit">{this.props.icon ? <SvgIcon>{this.props.icon}</SvgIcon> : this.props.value}</button>
      </form>
    );
  }
}
