import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import * as THREE from 'three';
import Furnishing from '../furnishings/furnishing';

const width = 800;
const height = 800;

function angle(x,y) {
  if(x>0) {
    return Math.atan(y/x);
  }
  if((x<0) && (y>0)) {
    return Math.PI - Math.atan(Math.abs(y/x));
  }
  if((x<0)&&(y<0)) {
    return -Math.PI + Math.atan(y/x);
  }
}

class MainCanvas extends React.Component {

  handleMouseMove = event => {
    if(this.props.lock.lockObtained && this.props.lock.furnishingId && this.props.lock.mouseDown) {
      if(this.props.mode.mode === "move") {
        this.props.moveX(3*4*event.movementX/width, this.props.lock.furnishingId, this.props.colors);
        this.props.moveZ(3*8*event.movementY/height, this.props.lock.furnishingId, this.props.colors);
      } else if (this.props.mode.mode === "rotate") {
        var scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        let xval = ((event.clientX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
        let yval = -((event.clientY-this.renderer.domElement.offsetTop+scrollOffset) / height) * 2 + 1;
        let diffx = xval - this.props.lock.mousex;
        let diffy = yval - this.props.lock.mousey;
        let dx = event.movementX / width;
        let dy = event.movementY / height;
        if( (diffx!==0) && (diffy!==0) && (dx!==0) && (dy!==0) ) {
          let theta1 = angle(diffx,diffy);
          let theta2 = angle(diffx+dx,diffy-dy);
          if(Math.abs(theta1-theta2) < Math.PI) {
            this.props.moveTheta( 3*(theta1-theta2), this.props.lock.furnishingId, this.props.colors );
          }
        }
      }
    }
  }

  handleMouseDown = event => {
    let mouse = new THREE.Vector2();
    var scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    mouse.x = ((event.clientX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
    mouse.y = -((event.clientY-this.renderer.domElement.offsetTop+scrollOffset) / height) * 2 + 1;
    this.props.setMouseDown(mouse.x,mouse.y)
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
      if( (this.props.mode.mode === "move") || (this.props.mode.mode === "rotate") ) {
        this.props.socket.emit("lockRequest",{furnishingId:furnishing.id});
        this.props.setLockRequested();
        this.props.setFurnishing(furnishing.id);
      } else if (this.props.mode.mode === "color") {
        this.props.updateColor(furnishing.id,this.props.mode.colorName,this.props.colors);
        this.props.socket.emit("updateColor",{furnishingId:furnishing.id,colorName:this.props.mode.colorName});
        this.props.setMode("move");
      } else if (this.props.mode.mode === "delete") {
        this.props.socket.emit("deleteFurnishing",{furnishingId:furnishing.id});
        this.props.deleteFurnishing(furnishing.id);
        this.props.setMode("move");
      }
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
    this.camera = new THREE.PerspectiveCamera(75,1,0.1,100);
    this.camera.position.x = 0.0;
    this.camera.position.y =  5.0;
    this.camera.position.z = 10.0;
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
    lock: state.lock,
    mode: state.mode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFurnishing : furnishingId => dispatch({type:"SET_FURNISHING",furnishingId:furnishingId}),
    unLock : () => dispatch({type:"UN_LOCK"}),
    setLockRequested: () => dispatch({type:"SET_LOCK_REQUESTED"}),
    roomDoNothing : () => dispatch({type:"ROOM_DO_NOTHING"}),
    moveX : (dx,furnishingId,colors) => dispatch({type:"MOVE_X",dx:dx,furnishingId:furnishingId,colors:colors}),
    moveZ : (dz,furnishingId,colors) => dispatch({type:"MOVE_Z",dz:dz,furnishingId:furnishingId,colors:colors}),
    moveTheta : (dtheta,furnishingId,colors) => dispatch({type:"MOVE_THETA",dtheta:dtheta,furnishingId:furnishingId,colors:colors}),
    setMouseDown : (mousex,mousey) => dispatch({type:"SET_MOUSE_DOWN",mousex:mousex,mousey:mousey}),
    unSetMouseDown : () => dispatch({type:"UN_SET_MOUSE_DOWN"}),
    dim: (furnishingId,colors) => dispatch({type:"DIM",furnishingId:furnishingId,colors:colors}),
    deleteFurnishing : (furnishingId) => dispatch({type:"DELETE_FURNISHING",furnishingId:furnishingId}),
    setMode : mode => dispatch({type:"SET_MODE",mode:mode}),
    updateColor : (furnishingId,colorName,colors) => dispatch({type:"UPDATE_COLOR",furnishingId:furnishingId,colorName:colorName,colors:colors})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MainCanvas);