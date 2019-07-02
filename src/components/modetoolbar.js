import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';
import Delete from '@material-ui/icons/Delete';
import RotateLeft from '@material-ui/icons/RotateLeft';
import ColorLens from '@material-ui/icons/ColorLens';
import PanTool from '@material-ui/icons/PanTool';

class ModeToolbar extends React.Component {
  onMoveClick = () => {
    this.props.setMode("move")
  }

  onRotateClick = () => {
    this.props.setMode("rotate")
  }


  onDeleteClick = () => {
    this.props.setMode("delete");
  }

  onColorClick = () => {
    this.props.setMode("color")
  }

  handleColorChange = event => {
    event.preventDefault();
    this.props.setColor(event.target.value)
  }

  render() {
    return (
      <div>
        <FormButton style={{backgroundColor: (this.props.mode.mode === "move" ? "yellow" : "" )}} value="Move" icon={<PanTool />} handleSubmit={() => this.onMoveClick()} />
        <FormButton icon={<RotateLeft />} style={{backgroundColor: (this.props.mode.mode === "rotate" ? "yellow" : "" )}} value="Rotate" handleSubmit={() => this.onRotateClick()} />
        <FormButton icon={<Delete />} style={{backgroundColor: (this.props.mode.mode === "delete" ? "yellow" : "" )}} value="Delete" handleSubmit={() => this.onDeleteClick()} />
        <FormButton style={{backgroundColor: (this.props.mode.mode === "color" ? "yellow" : "" )}} value="Color" icon={<ColorLens />} handleSubmit={() => this.onColorClick()} />
        <select value={this.props.mode.colorName} onChange={this.handleColorChange}>
          {
            Object.keys(this.props.colors).map(
              key => {
                return  (<option>{this.props.alphanumericFilter(key)}</option>);
              }
            )
          }
        </select>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mode: state.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMode : mode => dispatch({type:"SET_MODE",mode:mode}),
    setColor: colorName => dispatch({type:"SET_COLOR",colorName:colorName})
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ModeToolbar);
