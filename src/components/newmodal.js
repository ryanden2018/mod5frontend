import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import Modal from './modal';

export default class NewModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p>Enter room name <span style={{color:"red"}}><b>(alphanumeric only, no spaces)</b></span>, and size from 1 to 10:</p>
        <p><input type="text" id="roomName" placeholder="Room name" />
        <input type="text" id="roomSize" placeholder="Room size" /></p>
        <FormButton value="Cancel" handleSubmit={this.props.cancelCallback} />
        <FormButton value="OK" handleSubmit={() => this.props.okCallback(document.querySelector("#roomName").value,
          document.querySelector("#roomSize").value)} />
      </div>
    );
  }
}
