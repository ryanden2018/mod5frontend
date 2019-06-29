import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import * as THREE from 'three';
import Furnishing from '../furnishings/furnishing';

const width = 800;
const height = 800;

class MainCanvas extends React.Component {

  handleMouseMove = event => {
    if(this.props.lock.lockObtained && this.props.lock.furnishingId && this.props.lock.mouseDown) {
      this.props.moveX(4*event.movementX/width, this.props.lock.furnishingId, this.props.colors);
      this.props.moveZ(8*event.movementY/height, this.props.lock.furnishingId, this.props.colors);
    }
  }

  handleMouseDown = event => {
    this.props.setMouseDown()
    let mouse = new THREE.Vector2();
    var scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    mouse.x = ((event.clientX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
    mouse.y = -((event.clientY-this.renderer.domElement.offsetTop+scrollOffset) / height) * 2 + 1;
    this.raycaster.setFromCamera( mouse, this.camera);
    var furnishing = null;
    var dist = -1;
    this.props.room.forEach( thisFurnishing => {
      var thisDist = thisFurnishing.checkIntersect(this.raycaster);
      if(thisDist > -0.99) {
        if((dist<-0.99) || (thisDist < dist)) {
          dist = thisDist;
          furnishing = thisFurnishing;
        }
      }
    });
    if(furnishing) {
      this.props.socket.emit("lockRequest",{furnishingId:furnishing.id});
      this.props.setLockRequested();
      this.props.setFurnishing(furnishing.id);
    }
  }

  handleMouseUp = event => {
  if(this.props.lock.lockObtained && this.props.lock.furnishingId) {
      this.props.socket.emit("lockRelease",{furnishing:
        this.props.room.find( furnishing => furnishing.id === this.props.lock.furnishingId ) });
      this.props.dim(this.props.lock.furnishingId,this.props.colors);
      this.props.unLock();
  }
  this.props.unSetMouseDown();
  }

  componentDidMount() {
    const canvas = document.querySelector("#mc");
    this.renderer = new THREE.WebGLRenderer({canvas});
    this.raycaster = new THREE.Raycaster();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera = new THREE.PerspectiveCamera(75,1,0.1,10);
    this.camera.position.x = -1.0;
    this.camera.position.y =  1.5;
    this.camera.position.z = 2.5;
    this.light = new THREE.DirectionalLight(0xFFFFFF,1,100);
    this.light.castShadow = true;
    this.light.shadow.bias = -0.0002;
    this.light.position.set(-1,2,4);

    this.interval = setInterval(
      () => {
        if(this.props.lock.lockObtained) {
          this.props.socket.emit("lockRefresh");
        }
      }
    , 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if(this.renderer && this.light && this.camera) {
      let scene = Furnishing.doInit(this.renderer,this.light,this.camera);
      this.props.room.forEach( furnishing => {
        furnishing.renderFurnishing(this.renderer,this.camera,this.light,scene);
      });
    }
    return ( 
      <div width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
       <canvas id="mc" width={width} height={height}>Your browser doesn't appear to support HTML5 Canvas.</canvas>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room,
    lock: state.lock
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFurnishing : furnishingId => dispatch({type:"SET_FURNISHING",furnishingId:furnishingId}),
    unLock : () => dispatch({type:"UN_LOCK"}),
    setLockRequested: () => dispatch({type:"SET_LOCK_REQUESTED"}),
    setDragging : () => dispatch({type:"SET_DRAGGING"}),
    unSetDragging : () => dispatch({type:"UN_SET_DRAGGING"}),
    roomDoNothing : () => dispatch({type:"ROOM_DO_NOTHING"}),
    moveX : (dx,furnishingId,colors) => dispatch({type:"MOVE_X",dx:dx,furnishingId:furnishingId,colors:colors}),
    moveZ : (dz,furnishingId,colors) => dispatch({type:"MOVE_Z",dz:dz,furnishingId:furnishingId,colors:colors}),
    setMouseDown : () => dispatch({type:"SET_MOUSE_DOWN"}),
    unSetMouseDown : () => dispatch({type:"UN_SET_MOUSE_DOWN"}),
    dim: (furnishingId,colors) => dispatch({type:"DIM",furnishingId:furnishingId,colors:colors})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MainCanvas);