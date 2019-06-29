import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';

class FurnishingsToolbar extends React.Component {

  render() {
    return ( 
    <div>
      <FormButton value="Bed" handleSubmit={() => this.props.addFurnishing("bed",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Chair" handleSubmit={() => this.props.addFurnishing("chair",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Desk" handleSubmit={() => this.props.addFurnishing("desk",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Table" handleSubmit={() => this.props.addFurnishing("table",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Bookcase" handleSubmit={() => this.props.addFurnishing("bookcase",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Dresser" handleSubmit={() => this.props.addFurnishing("dresser",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Long Table" handleSubmit={() => this.props.addFurnishing("longtable",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Night Stand" handleSubmit={() => this.props.addFurnishing("nightstand",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Sofa" handleSubmit={() => this.props.addFurnishing("sofa",this.props.socket,this.props.colors,this.props.mode.colorName)} />
      <FormButton value="Stool" handleSubmit={() => this.props.addFurnishing("stool",this.props.socket,this.props.colors,this.props.mode.colorName)} />
    </div> );
  }
}

const mapStateToProps = state => {
  return {
    mode: state.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFurnishing: (name,socket,colors,colorName) => dispatch( {type:"ADD_FURNISHING",name:name,socket:socket,colors:colors,colorName:colorName} )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FurnishingsToolbar);
