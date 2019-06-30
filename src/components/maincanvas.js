import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import * as THREE from 'three';
import FormButton from './formbutton';
import Furnishing from '../furnishings/furnishing';

const width = 800;
const height = 600;

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

  state = { cameraDispX: 0.0, cameraDispZ: 0.0, cameraRotDispY: 0.0,
    rotatingCameraMode: false }

  resetCamera = () => {
    this.setState(
      { cameraDispX: 0.0, cameraDispZ: 0.0, cameraRotDispY: 0.0, 
        rotatingCameraMode: false }
    );
  }


  handleMouseMove = event => {
    if(this.props.lock.lockObtained && this.props.lock.furnishingId && this.props.lock.mouseDown) {
      if(this.props.mode.mode === "move") {
        this.props.moveX(this.props.roomProperties.width*event.movementX/width, this.props.lock.furnishingId, this.props.colors);
        this.props.moveZ(this.props.roomProperties.length*event.movementY/height, this.props.lock.furnishingId, this.props.colors);
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
            this.props.moveTheta( 3*(theta2-theta1), this.props.lock.furnishingId, this.props.colors );
          }
        }
      }
    } else if ( this.props.lock.mouseDown ) {
      if( !this.state.rotatingCameraMode ) {
        let a = -this.props.roomProperties.width*event.movementX/width;
        let b = -this.props.roomProperties.length*event.movementY/height;
        let theta = this.state.cameraRotDispY;
        this.setState({
          cameraDispX: this.state.cameraDispX + a*Math.cos(theta) + b*Math.sin(theta),
          cameraDispZ: this.state.cameraDispZ - a*Math.sin(theta) + b*Math.cos(theta) } )
      } else {
        this.setState({
          cameraRotDispY: this.state.cameraRotDispY + 5*event.movementX/width
        });
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
    this.renderer = new THREE.WebGLRenderer({canvas:canvas,physicallyCorrectLights:true});
    this.raycaster = new THREE.Raycaster();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera = new THREE.PerspectiveCamera(75,width/height,0.1,100);
    this.light = new THREE.PointLight(0xFFFFFF,1,100);
    this.light.decay = 2;
    this.ambientLight = new THREE.AmbientLight( 0x404040 );

    this.interval = setInterval(
      () => {
        if(this.props.lock.lockObtained) {
          this.props.socket.emit("lockRefresh");
        }
      }
    , 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  handleMoveCamera = () => {
    this.setState( { rotatingCameraMode: false } )
  }

  handleRotateCamera = () => {
    this.setState( { rotatingCameraMode: true} )
  }

  render() {
    if(this.renderer && this.light && this.camera) {
      let scene = Furnishing.doInit(this.renderer,this.light,this.camera);
      this.props.room.forEach( furnishing => {
        furnishing.renderFurnishing(this.renderer,this.camera,this.light,scene);
      });

      this.camera.position.x = 0.0 + this.state.cameraDispX;
      this.camera.position.y =  this.props.roomProperties.height * 0.5;
      this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
      this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
      this.light.castShadow = true;
      this.light.shadow.bias = -0.0002;
      this.light.position.set(0,0.9*this.props.roomProperties.height, 0*0.9*this.props.roomProperties.length / 2);
      this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.floor.receiveShadow = true;
      this.floor.castShadow = true;
      this.floor.rotation.x = Math.PI/2;
      this.ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.ceiling.receiveShadow = true;
      this.ceiling.castShadow = true;
      this.ceiling.rotation.x = Math.PI/2;
      this.ceiling.position.set(0,this.props.roomProperties.height,0);
      this.wallLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.wallLeft.receiveShadow = true;
      this.wallLeft.castShadow = true;
      this.wallLeft.rotation.y = 1.0*Math.PI/2;
      this.wallLeft.position.set(-this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
      this.wallRight = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.wallRight.receiveShadow = true;
      this.wallRight.castShadow = true;
      this.wallRight.rotation.y = 1.0*Math.PI/2;
      this.wallRight.position.set(this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
      this.wallBack = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.wallBack.receiveShadow = true;
      this.wallBack.castShadow= true;
      this.wallBack.position.set(0, this.props.roomProperties.height/2, -this.props.roomProperties.length/2);
      this.wallFront = new THREE.Mesh(
        new THREE.PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new THREE.MeshPhongMaterial({color:"white",side:THREE.DoubleSide}) );
      this.wallFront.receiveShadow = true;
      this.wallFront.castShadow = true;
      this.wallFront.position.set(0, this.props.roomProperties.height/2, this.props.roomProperties.length/2);
  



      scene.add(this.floor);
      scene.add(this.wallLeft);
      scene.add(this.wallRight);
      scene.add(this.wallBack);
      scene.add(this.ceiling);
      scene.add(this.wallFront);
      scene.add(this.ambientLight);
      this.renderer.render(scene,this.camera)
    }
    return ( 
      <>
        <FormButton value="Reset Camera" handleSubmit={this.resetCamera} />
        <FormButton style={{backgroundColor: (this.state.rotatingCameraMode ? "white" : "yellow")}} value="Move Camera" handleSubmit={this.handleMoveCamera} />
        <FormButton style={{backgroundColor: (this.state.rotatingCameraMode ? "yellow" : "white")}} value="Rotate Camera" handleSubmit={this.handleRotateCamera} />
        <div width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
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