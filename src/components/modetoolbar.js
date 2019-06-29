import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import FormButton from './formbutton';

class ModeToolbar extends React.Component {
  onMoveClick = () => {
    this.props.setMode("move")
  }

  onRotateClick = () => {
    this.props.setMode("rotate")
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
        <FormButton style={{backgroundColor: (this.props.mode.mode === "move" ? "yellow" : "" )}} value="Move" handleSubmit={() => this.onMoveClick()} />
        <FormButton style={{backgroundColor: (this.props.mode.mode === "rotate" ? "yellow" : "" )}} value="Rotate" handleSubmit={() => this.onRotateClick()} />
        <FormButton style={{backgroundColor: (this.props.mode.mode === "color" ? "yellow" : "" )}} value="Color" handleSubmit={() => this.onColorClick()} />
        <select onChange={this.handleColorChange}>
          {
            Object.keys(this.props.colors).map(
              key => {
                return ( key === this.props.mode.colorName ? <option selected="selected">{key}</option> : <option>{key}</option>);
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
