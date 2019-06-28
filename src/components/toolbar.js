import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';

class Toolbar extends React.Component {

  render() {
    return ( 
    <div>
      <FormButton value="Bed" handleSubmit={() => this.props.addFurnishing("bed",this.props.socket)} />
      <FormButton value="Chair" handleSubmit={() => this.props.addFurnishing("chair",this.props.socket)} />
      <FormButton value="Desk" handleSubmit={() => this.props.addFurnishing("desk",this.props.socket)} />
      <FormButton value="Table" handleSubmit={() => this.props.addFurnishing("table",this.props.socket)} />
      <FormButton value="Bookcase" handleSubmit={() => this.props.addFurnishing("bookcase",this.props.socket)} />
      <FormButton value="Dresser" handleSubmit={() => this.props.addFurnishing("dresser",this.props.socket)} />
      <FormButton value="Long Table" handleSubmit={() => this.props.addFurnishing("longtable",this.props.socket)} />
      <FormButton value="Night Stand" handleSubmit={() => this.props.addFurnishing("nightstand",this.props.socket)} />
      <FormButton value="Sofa" handleSubmit={() => this.props.addFurnishing("sofa",this.props.socket)} />
      <FormButton value="Stool" handleSubmit={() => this.props.addFurnishing("stool",this.props.socket)} />
    </div> );
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishing: (name,socket) => dispatch( {type:"addFurnishing",name:name,socket:socket} )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
