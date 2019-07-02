import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import Modal from './modal';

export default class OpenModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p>Choose room to open:</p>
        <p>
        {
          <select id="openSelect" onChange={e => e.preventDefault()}>
          <option value="-1">Select a room...</option>
          {
            Object.keys(this.props.availableRooms).map(
              key => {
                let room = this.props.availableRooms[key]
                return ( <option value={this.props.alphanumericFilter(room.id)}>{this.props.alphanumericFilter(room.name)}</option> );
              }
            )
          }
          </select>
        }
        </p>
        <p><FormButton value="Cancel" handleSubmit={this.props.cancelCallback} />
        <FormButton value="OK" handleSubmit={() => this.props.okCallback(document.querySelector("#openSelect").value)} /></p>
      </div>
    );
  }
}
