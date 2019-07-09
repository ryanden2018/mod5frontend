import React from 'react';
import '../App.css';
import FormButton from '../components/formbutton';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Modal from './modal';
import AccountBox from '@material-ui/icons/AccountBox';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import FolderOpen from '@material-ui/icons/FolderOpen';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Help from '@material-ui/icons/Help';
import PanTool from '@material-ui/icons/PanTool';
import RotateLeft from '@material-ui/icons/RotateLeft';
import AddCircle from '@material-ui/icons/AddCircle';
import Delete from '@material-ui/icons/Delete';
import ColorLens from '@material-ui/icons/ColorLens';
import ThreeSixty from '@material-ui/icons/ThreeSixty';
import BorderOuter from '@material-ui/icons/BorderOuter';
import CameraAlt from '@material-ui/icons/CameraAlt';
import CenterFocusStrong from '@material-ui/icons/CenterFocusStrong';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';

export default class HelpModal extends Modal {
  constructor() {
    super();
    this.iconStyle = {verticalAlign:"middle",margin:"10px"}
  }

  render() {
    return (
      <div style={{...this.style,left:"100px",top:"50px",width:'600px'}}>
        <div id="helpDiv" style={{height:"450px",overflow:"scroll"}}>
The purpose of this app is to assist in the process of prototyping the 
design and layout of a room's interior space. The app is purely web-based;
changes are saved automatically at all times, and several users can collaborate on
the same room simultaneously.
<h4>Action Guide</h4>
<ul style={{listStyle:"none"}}>
<li><DirectionsWalk style={this.iconStyle} />Logout</li>
<li><Help style={this.iconStyle} />Open this help box</li>
<li><AccountBox style={this.iconStyle} />Manage Account</li>
<li><Create style={this.iconStyle} />Create New Room</li>
<li><FolderOpen style={this.iconStyle} />Open a Room</li>
<li><PersonAdd style={this.iconStyle} /><em>(if owner)</em> Invite a user to collaborate on this room</li>
<li><DeleteForever style={this.iconStyle} /><em>(if owner)</em> Delete this room <em>permanently</em></li>
<li><Undo style={this.iconStyle} />Undo the previous action</li>
<li><Redo style={this.iconStyle} />Redo</li>
<li><PanTool style={this.iconStyle} /><em>(when selected)</em> Move an item via drag and drop</li>
<li><RotateLeft style={this.iconStyle} /><em>(when selected)</em> Rotate an item via drag and drop</li>
<li><AddCircle style={this.iconStyle} /><em>(when selected)</em> Add an item to the room</li>
<li><Delete style={this.iconStyle} /><em>(when selected)</em> Delete an item by clicking on it</li>
<li><ColorLens style={this.iconStyle} /><em>(when selected)</em> Change the color of an item</li>
<li><CameraAlt style={this.iconStyle} />Reset the camera view</li>
<li><CenterFocusStrong style={this.iconStyle} /><em>(when selected)</em> Move the camera view</li>
<li><ThreeSixty style={this.iconStyle} /><em>(when selected)</em> Rotate the camera view</li>
<li><BorderOuter style={this.iconStyle} />Overhead view</li>
</ul>
        </div>
        <FormButton icon={<KeyboardArrowUp />} value="Up" handleSubmit={() => (document.querySelector("#helpDiv").scrollTop -= 100)} />
        <FormButton icon={<KeyboardArrowDown />} value="Down" handleSubmit={() => (document.querySelector("#helpDiv").scrollTop += 100)} />
        <FormButton value="OK" handleSubmit={this.props.okCallback} />
      </div>
    );
  }
}
