import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import ModeToolbar from './modetoolbar';
import FileToolbar from './filetoolbar';
import { Scene, Color, DoubleSide,Mesh,PlaneGeometry,MeshPhongMaterial,Vector2,WebGLRenderer,Raycaster,PCFSoftShadowMap,PerspectiveCamera,PointLight,AmbientLight } from 'three';
import FormButton from './formbutton';
import Furnishing from '../furnishings/furnishing';
import ThreeSixty from '@material-ui/icons/ThreeSixty';
import BorderOuter from '@material-ui/icons/BorderOuter';
import CameraAlt from '@material-ui/icons/CameraAlt';
import Help from '@material-ui/icons/Help';
import CenterFocusStrong from '@material-ui/icons/CenterFocusStrong';
import apiurl from './apiurl';
import 'whatwg-fetch'
import 'promise-polyfill/src/polyfill';

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
      rotatingCameraMode: false, overheadView: false, roomId: null };

  constructor() {
    super();
    this.garbage = []; // everything in here must have a .dispose() method
  }

  tossGarbage = () => {
    while(this.garbage.length > 0) {
      let trash = this.garbage.pop();
      if(trash.dispose) {
        trash.dispose();
      }
    }
  }

  openRoom = (inputVal) => {
    let roomId = parseInt(inputVal);
    if(roomId !== -1) {
      fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
      .then( res => res.json() )
      .then( room => {
        this.props.setRoomProperties(room);
        this.rebuildRoom();
        fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}/furnishings`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
        .then(res => res.json() )
        .then( furnishings => {
          if(!furnishings.error) {
            this.props.removeAllFurnishings();
            Object.keys(furnishings).forEach(
              key => {
                this.props.addFurnishingFromObject(furnishings[key],this.props.colors,this.renderer,this.camera,this.scene);
              }
            );
            this.props.socket.emit("join",{roomId:roomId});

            fetch(`${apiurl}/api/rooms/${this.props.alphanumericFilter(roomId)}/isOwner`,{method:'GET',headers:{"Authorization":`Bearer ${localStorage.token}`},credentials:'include'})
            .then(res=>res.json())
            .then( results => {
              if(results.status) {
                this.props.setIsOwner(true);
              } else {
                this.props.setIsOwner(false);
              }
            }).catch( () => { } );

            this.props.setErrMsg("");
            this.setState({roomId: roomId});


          } else {
            this.props.setErrMsg("Could not open room");
            this.disposeAllFurnishings(true);
            this.props.resetEverything();
          } 
        }).catch( () => {
          this.props.setErrMsg("Could not open room");
          this.disposeAllFurnishings(true);
          this.props.resetEverything();
        });
      }).catch( () => {
         this.props.setErrMsg("Could not open room");
         this.disposeAllFurnishings(true);
         this.props.resetEverything();
      });
    
    }
  }


  newRoom = (roomName,roomSize) => {
    let name = this.props.alphanumericFilter(roomName)
    let size = this.props.alphanumericFilter(roomSize)
    if(name && size && size.match(/^\d+$/) && (parseInt(size)>0) && (parseInt(size)<11)) {
      fetch(`${apiurl}/api/rooms`, { method:"POST",
        headers: {"Content-type":"application/json","Authorization":`Bearer ${localStorage.token}`},
        credentials:'include',
        body: JSON.stringify( {room:{name:name,length:parseInt(size)+3,width:parseInt(size)+3,height:4}} ) }
      ).then( res => res.json() )
      .then( data => {
        if(!data.error) {
          this.props.setIsOwner(true);
          this.props.setRoomProperties(data);
          this.rebuildRoom();
          this.props.socket.emit("join",{roomId:data.id});
          this.setState({roomId: data.id});
        } else {
          this.props.setErrMsg("Could not create room");
        }
      })
      .catch( () => this.props.setErrMsg("Could not create room") );
    } else {
      this.props.setErrMsg("Could not create room");
    }
  }




  resetCamera = () => {
    this.setState(
      { cameraDispX: 0.0, cameraDispZ: 0.0, cameraRotDispY: 0.0, 
        rotatingCameraMode: false, overheadView: false },
        () => {
          this.camera.position.x = 0.0 + this.state.cameraDispX;
          this.camera.position.y =  this.props.roomProperties.height * 0.5;
          this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
          this.camera.rotation.x = 0.0;
          this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
          this.camera.rotation.z = 0.0;
          this.renderer.render(this.scene,this.camera);
        }
    );
    
  }

  moveX = (diffX, furnishingId) => {
    var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
    furnishing.moveX(diffX);
    this.renderer.render(this.scene,this.camera);
  }


  moveZ = (diffZ, furnishingId) => {
    var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
    furnishing.moveZ(diffZ);
    this.renderer.render(this.scene,this.camera);
  }

  moveTheta = (diffTheta, furnishingId) => {
    var furnishing = this.props.room.find( furnishing => furnishing.id === furnishingId );
    furnishing.moveTheta(diffTheta);
    this.renderer.render(this.scene,this.camera);
  }

  handleMouseMove = event => {
    event.preventDefault();
    this.handleMove(event.clientX,event.clientY,event.movementX,event.movementY);
  }

  handleTouchMove = event => {
    event.preventDefault();
    let lastTouchMoveX = this.lastTouchMoveX;
    let lastTouchMoveY = this.lastTouchMoveY;
    this.lastTouchMoveX = event.touches[0].clientX;
    this.lastTouchMoveY = event.touches[0].clientY;
    if(lastTouchMoveX && lastTouchMoveY) {
      this.handleMove(event.touches[0].clientX,event.touches[0].clientY,
        event.touches[0].clientX-lastTouchMoveX,
        event.touches[0].clientY-lastTouchMoveY);
    }
  }

  handleMove = (clientX,clientY,movementX,movementY) => {
    if(this.props.lock.lockObtained && this.props.lock.furnishingId && this.props.lock.mouseDown) {
      if(this.props.mode.mode === "move") {
        if(!this.state.overheadView) {
          let a = this.props.roomProperties.width*movementX/width;
          let b = this.props.roomProperties.length*movementY/height;
          let theta = this.state.cameraRotDispY;
          let diffX = a*Math.cos(theta)+b*Math.sin(theta);
          let diffZ = -1*a*Math.sin(theta)+b*Math.cos(theta);
          this.moveX(diffX, this.props.lock.furnishingId);
          this.moveZ(diffZ, this.props.lock.furnishingId);
          this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:diffX, diffZ:diffZ, diffTheta:0.0});
        } else {
          let diffX = this.props.roomProperties.width*movementX/width;
          let diffZ = this.props.roomProperties.length*movementY/height
          this.moveX(diffX, this.props.lock.furnishingId);
          this.moveZ(diffZ, this.props.lock.furnishingId);
          this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:diffX, diffZ:diffZ, diffTheta:0.0});
        }
      } else if (this.props.mode.mode === "rotate") {
        var scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        let xval = ((clientX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
        let yval = -((clientY-this.renderer.domElement.offsetTop+scrollOffset) / height) * 2 + 1;
        let diffx = xval - this.props.lock.mousex;
        let diffy = yval - this.props.lock.mousey;
        let dx = movementX / width;
        let dy = movementY / height;
        if( (diffx!==0) && (diffy!==0) && (dx!==0) && (dy!==0) ) {
          let theta1 = angle(diffx,diffy);
          let theta2 = angle(diffx+dx,diffy-dy);
          if(Math.abs(theta1-theta2) < Math.PI) {
            let diffTheta = 3*(theta2-theta1);
            this.moveTheta( diffTheta, this.props.lock.furnishingId );
            this.props.socket.emit("mouseMoved", {furnishingId: this.props.lock.furnishingId, diffX:0.0, diffZ:0.0, diffTheta:diffTheta})
          }
        }
      }
    } else if ( this.props.lock.mouseDown ) {
      if( (!this.state.rotatingCameraMode) && (!this.state.overheadView) ) {
        let a = -this.props.roomProperties.width*movementX/width;
        let b = -this.props.roomProperties.length*movementY/height;
        let theta = this.state.cameraRotDispY;
        this.setState({
          cameraDispX: this.state.cameraDispX + a*Math.cos(theta) + b*Math.sin(theta),
          cameraDispZ: this.state.cameraDispZ - a*Math.sin(theta) + b*Math.cos(theta) },
          () => {
            this.camera.position.x = 0.0 + this.state.cameraDispX;
            this.camera.position.y =  this.props.roomProperties.height * 0.5;
            this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
            this.camera.rotation.x = 0.0;
            this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
            this.camera.rotation.z = 0.0;
            this.renderer.render(this.scene,this.camera);
           } )
      } else if (!this.state.overheadView) {
        this.setState({
          cameraRotDispY: this.state.cameraRotDispY + 5*movementX/width
        }, () => {
          this.camera.position.x = 0.0 + this.state.cameraDispX;
          this.camera.position.y =  this.props.roomProperties.height * 0.5;
          this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
          this.camera.rotation.x = 0.0;
          this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
          this.camera.rotation.z = 0.0;
          this.renderer.render(this.scene,this.camera);
        });
      }
    }
  }

  handleMouseDown = event => {
    event.preventDefault();
    this.handleDown( event.clientX, event.clientY );
  }

  handleTouchStart = event => {
    event.preventDefault();
    this.handleDown(event.touches[0].clientX,event.touches[0].clentY);
  }

  handleDown = (clientX,clientY) => {
    let mouse = new Vector2();
    var scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    mouse.x = ((clientX-this.renderer.domElement.offsetLeft) / width) * 2 - 1;
    mouse.y = -((clientY-this.renderer.domElement.offsetTop+scrollOffset) / height) * 2 + 1;
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
        furnishing.colorName = this.props.mode.colorName;
        furnishing.red = this.props.colors[this.props.mode.colorName].red;
        furnishing.green = this.props.colors[this.props.mode.colorName].green;
        furnishing.blue = this.props.colors[this.props.mode.colorName].blue;
        furnishing.fillColor();
        this.renderer.render(this.scene,this.camera);
        this.props.socket.emit("updateColor",{furnishingId:furnishing.id,colorName:this.props.mode.colorName});
        this.props.setMode("move");
      } else if (this.props.mode.mode === "delete") {
        this.props.socket.emit("deleteFurnishing",{furnishingId:furnishing.id});
        furnishing.removeFrom(this.scene);
        this.props.deleteFurnishing(furnishing.id);
        this.renderer.render(this.scene,this.camera);
        this.props.setMode("move");
      }
    }
  }

  handleMouseUp = event => {
    event.preventDefault();
    this.handleUp();
  }

  handleTouchEnd = event => {
    event.preventDefault();
    this.handleUp();
  }

  handleUp = () => {
    if(this.props.lock.lockObtained && this.props.lock.furnishingId) {
        this.props.socket.emit("lockRelease",{furnishing:
          this.props.room.find( furnishing => furnishing.id === this.props.lock.furnishingId ) });
        this.props.dim(this.props.lock.furnishingId,this.props.colors);
        this.props.unLock();
    }
    this.props.unSetMouseDown();
    this.tossGarbage();
  }

  buildSocketEvents = () => {
    this.props.socket.on('disconnect', () => {
      this.props.setErrMsg( "There is a problem with the connection." );
      this.disposeAllFurnishings(true);
      this.props.resetEverything();
    });

    this.props.socket.on('reconnect',() => {
      this.props.setErrMsg("");
      this.openRoom(this.state.roomId);
    });

    this.props.socket.on('roomDeleted',() => {
      this.props.setErrMsg("The room was deleted.");
      this.props.socket.emit("removeFromAllRooms");
      this.disposeAllFurnishings(true);
      this.props.resetEverything();
    });

    this.props.socket.on("create",payload=>{
      this.props.addFurnishingFromObject(payload.furnishing,this.props.colors,this.renderer,this.camera,this.scene)
    });

    this.props.socket.on("lockResponse",payload=>{
      if(payload === "approved") {
        this.props.setLockApproved();
        this.props.brighten(this.props.lock.furnishingId,this.props.colors);
      } else {
        this.props.unLock();
      }
    });

    this.props.socket.on("update", payload => {
      let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishing.id );
      if(furnishing) {
        furnishing.updateFromObject(payload.furnishing,this.props.colors);
        this.renderer.render(this.scene,this.camera);
      }
    });

    this.props.socket.on("delete", payload=>{
      let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId);
      if(furnishing) {
        furnishing.removeFrom(this.scene);
        this.props.deleteFurnishing(payload.furnishingId);
        this.renderer.render(this.scene,this.camera);
      }
    });

    this.props.socket.on("colorUpdate",payload=>{
      let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId );
      if(furnishing) {
        furnishing.colorName = payload.colorName;
        furnishing.red = this.props.colors[payload.colorName].red;
        furnishing.green = this.props.colors[payload.colorName].green;
        furnishing.blue = this.props.colors[payload.colorName].blue;
        furnishing.fillColor();
        this.renderer.render(this.scene,this.camera);
      }
    });

    this.props.socket.on("availableRooms", payload => {
      this.props.setAvailableRooms(payload.availableRooms)
    });

    this.props.socket.on("mouseMoved",payload => {
      let furnishing = this.props.room.find( furnishing => furnishing.id === payload.furnishingId );
      if(furnishing) {
        furnishing.moveX(payload.diffX);
        furnishing.moveZ(payload.diffZ);
        furnishing.moveTheta(payload.diffTheta);
        this.renderer.render(this.scene,this.camera);
      }
    });
  }



  componentDidMount() {
    this.buildSocketEvents();

    const canvas = document.querySelector("#mc");
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


  disposeAllFurnishings = (reRender) => {
    if(this.props.room) {
      for(let i = 0; i < this.props.room.length; i++) {
        let furnishing = this.props.room[i];
        furnishing.removeFrom(this.scene);
      }
      this.props.removeAllFurnishings();
      if(reRender) {
        this.scene.dispose();
        this.scene = new Scene();
        this.scene.background = new Color(0xffffff);
        this.renderer.render(this.scene,this.camera);
      }
    }
  }


  componentWillUnmount() {
    this.disposeAllFurnishings();

    this.removeTransients();
    this.tossGarbage();
    this.props.resetEverything();

    clearInterval(this.interval);
    this.interval = null;
  }


  handleMoveCamera = () => {
    this.setState( { rotatingCameraMode: false, overheadView: false } )
    this.camera.position.x = 0.0 + this.state.cameraDispX;
    this.camera.position.y =  this.props.roomProperties.height * 0.5;
    this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
    this.camera.rotation.x = 0.0;
    this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
    this.camera.rotation.z = 0.0;
    this.renderer.render(this.scene,this.camera);
  }

  handleRotateCamera = () => {
    this.setState( { rotatingCameraMode: true, overheadView: false } )
    this.camera.position.x = 0.0 + this.state.cameraDispX;
    this.camera.position.y =  this.props.roomProperties.height * 0.5;
    this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
    this.camera.rotation.x = 0.0;
    this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
    this.camera.rotation.z = 0.0;
    this.renderer.render(this.scene,this.camera);
  }

  handleOverhead = () => {
    this.setState( { rotatingCameraMode: false, overheadView: true } );
    this.camera.position.x = 0.0;
    this.camera.position.y = this.props.roomProperties.width*0.95;
    this.camera.position.z = 0.0;
    this.camera.rotation.x = -Math.PI/2;
    this.camera.rotation.y = 0.0;
    this.camera.rotation.z = 0.0;
    this.renderer.render(this.scene,this.camera);
  }


  removeTransients = () => {
    if(this.scene) { this.scene.dispose(); }
    if(this.floor) {
      this.garbage.push(this.floor.geometry);
      this.garbage.push(this.floor.material);
      delete this.floor;
    }
    if(this.ceiling) {
      this.garbage.push(this.ceiling.geometry);
      this.garbage.push(this.ceiling.material);
      delete this.ceiling;
    }
    if(this.wallLeft) {
      this.garbage.push(this.wallLeft.geometry);
      this.garbage.push(this.wallLeft.material);
      delete this.wallLeft;
    }
    if(this.wallRight) {
      this.garbage.push(this.wallRight.geometry);
      this.garbage.push(this.wallRight.material);
      delete this.wallRight;
    }
    if(this.wallBack) {
      this.garbage.push(this.wallBack.geometry);
      this.garbage.push(this.wallBack.material);
      delete this.wallBack;
    }
    if(this.wallFront) {
      this.garbage.push(this.wallFront.geometry);
      this.garbage.push(this.wallFront.material);
      delete this.wallFront;
    }
  }


  rebuildRoom = () => {
    if(this.renderer && this.light && this.camera) {
      this.removeTransients();
      this.tossGarbage();
      this.disposeAllFurnishings();


      this.scene = Furnishing.doInit(this.renderer,this.light,this.camera);

      if(!this.state.overheadView) {
        this.camera.position.x = 0.0 + this.state.cameraDispX;
        this.camera.position.y =  this.props.roomProperties.height * 0.5;
        this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
        this.camera.rotation.x = 0.0;
        this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
        this.camera.rotation.z = 0.0;
      } else {
        this.camera.position.x = 0.0;
        this.camera.position.y = this.props.roomProperties.width*0.95;
        this.camera.position.z = 0.0;
        this.camera.rotation.x = -Math.PI/2;
        this.camera.rotation.y = 0.0;
        this.camera.rotation.z = 0.0;
      }
      this.light.castShadow = true;
      this.light.shadow.bias = -0.0002;
      this.light.position.set(0,0.9*this.props.roomProperties.height, 0*0.9*this.props.roomProperties.length / 2);
      this.floor = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
        new MeshPhongMaterial({color:"white",side:DoubleSide}) );
      this.floor.receiveShadow = true;
      this.floor.castShadow = true;
      this.floor.rotation.x = Math.PI/2;
      this.floor.position.y = 0.15;
      this.ceiling = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
        new MeshPhongMaterial({color:"white"}) );
      this.ceiling.receiveShadow = true;
      this.ceiling.castShadow = true;
      this.ceiling.rotation.x = Math.PI/2;
      this.ceiling.position.set(0,this.props.roomProperties.height,0);
      this.wallLeft = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new MeshPhongMaterial({color:"white"}) );
      this.wallLeft.receiveShadow = true;
      this.wallLeft.castShadow = true;
      this.wallLeft.rotation.y = 1.0*Math.PI/2;
      this.wallLeft.position.set(-this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
      this.wallRight = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new MeshPhongMaterial({color:"white"}) );
      this.wallRight.receiveShadow = true;
      this.wallRight.castShadow = true;
      this.wallRight.rotation.y = -1.0*Math.PI/2;
      this.wallRight.position.set(this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
      this.wallBack = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new MeshPhongMaterial({color:"white"}) );
      this.wallBack.receiveShadow = true;
      this.wallBack.castShadow= true;
      this.wallBack.position.set(0, this.props.roomProperties.height/2, -this.props.roomProperties.length/2);
      this.wallFront = new Mesh(
        new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
        new MeshPhongMaterial({color:"white"}) );
      this.wallFront.rotation.y = Math.PI;
      this.wallFront.receiveShadow = true;
      this.wallFront.castShadow = true;
      this.wallFront.position.set(0, this.props.roomProperties.height/2, this.props.roomProperties.length/2);
  



      this.scene.add(this.floor);
      this.scene.add(this.wallLeft);
      this.scene.add(this.wallRight);
      this.scene.add(this.wallBack);
      this.scene.add(this.ceiling);
      this.scene.add(this.wallFront);
      this.scene.add(this.ambientLight);
      this.renderer.render(this.scene,this.camera)
    }
  }


  render() {
    if(this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene,this.camera);
    }

    return ( 
      <>
      <FileToolbar newRoom={this.newRoom} openRoom={this.openRoom} disposeAllFurnishings={this.disposeAllFurnishings} rebuildRoom={this.rebuildRoom} renderer={() => this.renderer} camera={() => this.camera} scene={() => this.scene} alphanumericFilter={this.props.alphanumericFilter} username={this.props.username} colors={this.props.colors} socket={this.props.socket} />
      <FormButton value="Help" icon={<Help />} handleSubmit={this.props.openHelp} />
      <div>
        {(!!this.props.roomProperties) ? <ModeToolbar renderer={() => this.renderer} camera={() => this.camera} scene={() => this.scene} alphanumericFilter={this.props.alphanumericFilter} socket={this.props.socket} colors={this.props.colors} username={this.props.username} /> : null }
        {(!!this.props.roomProperties) ? <FormButton icon={<CameraAlt />} value="Reset Camera" handleSubmit={this.resetCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: ((this.state.rotatingCameraMode || this.state.overheadView) ? "white" : "yellow")}} icon={<CenterFocusStrong />} value="Move Camera" handleSubmit={this.handleMoveCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: ((this.state.rotatingCameraMode && (!this.state.overheadView)) ? "yellow" : "white")}} icon={<ThreeSixty />} value="Rotate Camera" handleSubmit={this.handleRotateCamera} /> : null }
        {(!!this.props.roomProperties) ? <FormButton style={{backgroundColor: (this.state.overheadView ? "yellow" : "white")}} value="Overhead View" icon={<BorderOuter />} handleSubmit={this.handleOverhead} /> : null }
      </div> 
        <div width={width} height={height} onMouseDown={this.handleMouseDown} onTouchStart={this.handleTouchStart} onMouseMove={this.handleMouseMove} onTouchMove={this.handleTouchMove} onMouseUp={this.handleMouseUp} onTouchEnd={this.handleMouseEnd}>
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
    setIsOwner: (val) => dispatch({type:"SET_IS_OWNER",val:val})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MainCanvas);