import React from 'react';
import '../App.css';
import FormButton from '../components/formbutton';
import Modal from './modal';

export default class AddModal extends Modal {
  constructor() {
    super();
    this.furnishingObj = {
      "bed" : "Bed",
      "bookcase" : "Book Case",
      "chair" : "Chair",
      "desk" : "Desk",
      "dresser" : "Dresser",
      "longtable" : "Long Table",
      "nightstand" : "Night Stand",
      "sofa" : "Sofa",
      "stool" : "Stool",
      "table" : "Table"
    };
  }

  render() {
    return (
      <div style={this.style}>
        <p>Choose furnishing to add:</p>
        <p>
        {
          <select id="furnishingSelect" onChange={e => e.preventDefault()}>
          <option value="-1">Select a furnishing...</option>
          {
            Object.keys(this.furnishingObj).map(
              key => {
                return ( <option value={key}>{this.furnishingObj[key]}</option> );
              }
            )
          }
          </select>
        }
        </p>
        <FormButton value="Cancel" handleSubmit={this.props.cancelCallback} />
        <FormButton value="OK" handleSubmit={() => this.props.okCallback(document.querySelector("#furnishingSelect").value)} />
      </div>
    );
  }
}
