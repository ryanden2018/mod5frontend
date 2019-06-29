import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import * as THREE from 'three';
import Furnishing from '../furnishings/furnishing';


class MainCanvas extends React.Component {

  componentDidMount() {
    const canvas = document.querySelector("#mc");
    this.renderer = new THREE.WebGLRenderer({canvas});
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
  }

  render() {
    if(this.renderer && this.light && this.camera) {
      let scene = Furnishing.doInit(this.renderer,this.light,this.camera);
      this.props.room.forEach( furnishing => {
        furnishing.renderFurnishing(this.renderer,this.camera,this.light,scene);
      });
    }
    return ( 
      <div>
       <canvas id="mc" width="800" height="800">Your browser doesn't appear to support HTML5 Canvas.</canvas>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MainCanvas);