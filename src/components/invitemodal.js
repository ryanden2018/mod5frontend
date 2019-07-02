import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import Modal from './modal';

export default class InviteModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p>Enter username of user to invite:</p>
        <p><input type="text" id="invitee" placeholder="User's username" /></p>
        <p><FormButton value="Cancel" handleSubmit={this.props.cancelCallback} />
        <FormButton value="OK" handleSubmit={() => this.props.okCallback(document.querySelector("#invitee").value)} /></p>
      </div>
    );
  }
}
