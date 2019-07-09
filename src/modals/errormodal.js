import React from 'react';
import '../App.css';
import FormButton from '../components/formbutton';
import Modal from './modal';

export default class ErrorModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p>{this.props.message}</p>
        <FormButton value="OK" handleSubmit={this.props.callback} />
      </div>
    );
  }
}
