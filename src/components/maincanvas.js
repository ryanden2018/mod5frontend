import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import ModeToolbar from './modetoolbar';
import FileToolbar from './filetoolbar';
import { Scene, Color,WebGLRenderer,Raycaster,PCFSoftShadowMap,PerspectiveCamera,PointLight,AmbientLight } from 'three';
import FormButton from './formbutton';
import ThreeSixty from '@material-ui/icons/ThreeSixty';
import BorderOuter from '@material-ui/icons/BorderOuter';
import CameraAlt from '@material-ui/icons/CameraAlt';
import Help from '@material-ui/icons/Help';
import CenterFocusStrong from '@material-ui/icons/CenterFocusStrong';
import openRoom from '../helpers/openRoom';
import newRoom from '../helpers/newRoom';
import rebuildRoom from '../helpers/rebuildRoom';
import resetCamera from '../helpers/resetCamera';
import handleMove from '../helpers/handleMove';
import width from '../constants/width';
import height from '../constants/height';
import handleDown from '../helpers/handleDown';
import handleUp from '../helpers/handleUp';
import buildSocketEvents from '../helpers/buildSocketEvents';
import removeTransients from '../helpers/removeTransients';
import tossGarbage from '../helpers/tossGarbage';
import moveX from '../helpers/moveX';
import moveZ from '../helpers/moveZ';
import moveTheta from '../helpers/moveTheta';
import handleMouseMove from '../helpers/handleMouseMove';
import handleTouchMove from '../helpers/handleTouchMove';
import handleMouseDown from '../helpers/handleMouseDown';
import handleTouchStart from '../helpers/handleTouchStart';
import handleMouseUp from '../helpers/handleMouseUp';
import handleTouchEnd from '../helpers/handleTouchEnd';
import disposeAllFurnishings from '../helpers/disposeAllFurnishings';
import handleMoveCamera from '../helpers/handleMoveCamera';
import handleRotateCamera from '../helpers/handleRotateCamera';
import handleOverhead from '../helpers/handleOverhead';


class MainCanvas extends React.Component {

  state = { cameraDispX: 0.0, cameraDispZ: 0.0, cameraRotDispY: 0.0,
      rotatingCameraMode: false, overheadView: false, roomId: null };

  constructor() {
    super();
    this.garbage = []; // everything in here must have a .dispose() method
  }

  tossGarbage = tossGarbage.bind(this);
  openRoom = openRoom.bind(this);
  newRoom = newRoom.bind(this);
  resetCamera = resetCamera.bind(this);
  handleMove = handleMove.bind(this);
  handleDown = handleDown.bind(this);
  handleUp = handleUp.bind(this);
  buildSocketEvents = buildSocketEvents.bind(this);
  rebuildRoom = rebuildRoom.bind(this);
  removeTransients = removeTransients.bind(this);
  moveX = moveX.bind(this);
  moveZ = moveZ.bind(this);
  moveTheta = moveTheta.bind(this);
  handleMouseMove = handleMouseMove.bind(this);
  handleTouchMove = handleTouchMove.bind(this);
  handleMouseDown = handleMouseDown.bind(this);
  handleTouchStart = handleTouchStart.bind(this);
  handleMouseUp = handleMouseUp.bind(this);
  handleTouchEnd = handleTouchEnd.bind(this);
  disposeAllFurnishings = disposeAllFurnishings.bind(this);
  handleMoveCamera = handleMoveCamera.bind(this);
  handleRotateCamera = handleRotateCamera.bind(this);
  handleOverhead = handleOverhead.bind(this);

  componentDidMount() {
    this.buildSocketEvents();
    const canvas = document.querySelector("#mc");
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({canvas:canvas,physicallyCorrectLights:true});
    this.raycaster = new Raycaster();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.camera = new PerspectiveCamera(75,width/height,0.1,100);
    this.light = new PointLight(0xFFFFFF,1,100);
    this.light.decay = 2;
    this.ambientLight = new AmbientLight( 0x404040 );
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);
    this.renderer.render(this.scene,this.camera);
    this.interval = setInterval(
      () => {
        if(this.props.lock.lockObtained) {
          this.props.socket.emit("lockRefresh");
        }
      }
    , 1000);
  }

  componentWillUnmount() {
    this.disposeAllFurnishings();

    this.removeTransients();
    this.tossGarbage();
    this.props.resetEverything();

    clearInterval(this.interval);
    this.interval = null;
  }

  render() {
    if(this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene,this.camera);
    }

    return ( 
      <>
      <FileToolbar newRoom={this.newRoom} openRoom={this.openRoom} disposeAllFurnishings={this.disposeAllFurnishings} renderer={() => this.renderer} camera={() => this.camera} scene={() => this.scene} alphanumericFilter={this.props.alphanumericFilter} username={this.props.username} colors={this.props.colors} socket={this.props.socket} />
      <FormButton value="Help" icon={<Help />} handleSubmit={this.props.openHelp} />
      <div>
        {(!!this.props.roomProperties) ? <ModeToolbar renderer={() => this.renderer} camera={() => this.camera} scene={() => this.scene} alphanumericFilter={this.props.alphanumericFilter} socket={this.props.socket} colors={this.props.colors} username={this.props.username} /> : null }
        {(!!this.props.roomProperties) ? <FormButton icon={<CameraAlt />} value="Reset Camera" handleSubmit={this.resetCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: ((this.state.rotatingCameraMode || this.state.overheadView) ? "white" : "yellow")}} icon={<CenterFocusStrong />} value="Move Camera" handleSubmit={this.handleMoveCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: ((this.state.rotatingCameraMode && (!this.state.overheadView)) ? "yellow" : "white")}} icon={<ThreeSixty />} value="Rotate Camera" handleSubmit={this.handleRotateCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: (this.state.overheadView ? "yellow" : "white")}} value="Overhead View" icon={<BorderOuter />} handleSubmit={this.handleOverhead} /> : null }
      </div> 
        <div width={width} height={height} onMouseDown={this.handleMouseDown} onTouchStart={this.handleTouchStart} onMouseMove={this.handleMouseMove} onTouchMove={this.handleTouchMove} onMouseUp={this.handleMouseUp} onTouchEnd={this.handleTouchEnd} onTouchCancel={this.handleTouchEnd} onMouseOut={this.handleMouseUp}>
          <canvas id="mc" width={width} height={height}>Your browser doesn't appear to support HTML5 Canvas.</canvas>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room,
    lock: state.lock,
    mode: state.mode,
    roomProperties: state.file.roomProperties
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFurnishing : furnishingId => dispatch({type:"SET_FURNISHING",furnishingId:furnishingId}),
    unLock : () => dispatch({type:"UN_LOCK"}),
    setLockApproved: () => dispatch({type:"SET_LOCK_APPROVED"}),
    brighten : (furnishingId, colors) => dispatch( { type:"BRIGHTEN", furnishingId:furnishingId, colors:colors } ),
    setLockRequested: () => dispatch({type:"SET_LOCK_REQUESTED"}),
    roomDoNothing : () => dispatch({type:"ROOM_DO_NOTHING"}),
    moveX : (dx,furnishingId,colors) => dispatch({type:"MOVE_X",dx:dx,furnishingId:furnishingId,colors:colors}),
    moveZ : (dz,furnishingId,colors) => dispatch({type:"MOVE_Z",dz:dz,furnishingId:furnishingId,colors:colors}),
    moveTheta : (dtheta,furnishingId,colors) => dispatch({type:"MOVE_THETA",dtheta:dtheta,furnishingId:furnishingId,colors:colors}),
    setMouseDown : (mousex,mousey) => dispatch({type:"SET_MOUSE_DOWN",mousex:mousex,mousey:mousey}),
    unSetMouseDown : () => dispatch({type:"UN_SET_MOUSE_DOWN"}),
    dim: (furnishingId,colors) => dispatch({type:"DIM",furnishingId:furnishingId,colors:colors}),
    setMode : mode => dispatch({type:"SET_MODE",mode:mode}),
    resetEverything : () => { dispatch({type:"REMOVE_ALL_FURNISHINGS"}); dispatch({type:"RESET_FILE"}); dispatch({type:"LOCK_LOGOUT"}); dispatch({type:"MODE_LOGOUT"}); },
    removeAllFurnishings : () => { dispatch({type:"REMOVE_ALL_FURNISHINGS"}) },
    addFurnishingFromObject: (obj,colors,renderer,camera,scene) => dispatch( {type:"ADD_FURNISHING_FROM_OBJECT",obj:obj,colors:colors,renderer:renderer,camera:camera,scene:scene} ),
    deleteFurnishing : (furnishingId) => dispatch({type:"DELETE_FURNISHING",furnishingId:furnishingId}),
    updateColor : (furnishingId,colorName,colors) => dispatch({type:"UPDATE_COLOR",furnishingId:furnishingId,colorName:colorName,colors:colors}),
    setAvailableRooms: rooms => dispatch( {type:"SET_AVAILABLE_ROOMS",rooms:rooms}),
    setRoomProperties: (roomProperties) => dispatch({type:"SET_ROOM_PROPERTIES",roomProperties:roomProperties}),
    setIsOwner: (val) => dispatch({type:"SET_IS_OWNER",val:val}),
    modeLogout : () => dispatch({type:"MODE_LOGOUT"}),
    lockLogout : () => dispatch({type:"LOCK_LOGOUT"}),
    fileLogout : () => dispatch({type:"FILE_LOGOUT"}),
    roomLogout : () => dispatch({type:"ROOM_LOGOUT"})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MainCanvas);