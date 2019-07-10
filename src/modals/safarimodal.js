import React from 'react';
import '../App.css';
import FormButton from '../components/formbutton';
import Modal from './modal';

export default class SafariModal extends Modal {
  render() {
    return (
      <div style={this.style}>
        <p><b>Safari users on MacOSX: </b> To use this site, you will need to 
        select <tt> Preferences </tt> from the <tt> Safari </tt> menu, click on 
        <tt> Privacy </tt>, and make sure that "Prevent cross-site tracking" is <b>not 
        selected</b>. Then you will need to restart Safari (<tt>Safari &gt; Quit Safari</tt>).
        This is because the authentication process uses something called <tt> XMLHttpRequest </tt> to set a cookie from
        a secondary domain (which I control), and Safari usually prohibits such cookies
        for privacy reasons.</p>
        <FormButton value="OK" handleSubmit={this.props.okCallback} />
      </div>
    );
  }
}
