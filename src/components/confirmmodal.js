import React from 'react';
import '../App.css';
import FormButton from './formbutton';
import Modal from './modal';

export default class ConfirmModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p>{this.props.message}</p>
        <FormButton value="Cancel" handleSubmit={this.props.cancelCallback} />
        <FormButton value="OK" handleSubmit={this.props.okCallback} />
      </div>
    );
  }
}
