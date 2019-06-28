import React from 'react';
import '../App.css';
import * as THREE from 'three';


import Furnishing from '../furnishings/furnishing';
import Table from '../furnishings/table';
import LongTable from '../furnishings/longtable';
import Stool from '../furnishings/stool';
import Chair from '../furnishings/chair';
import Bed from '../furnishings/bed';
import Dresser from '../furnishings/dresser';
import Desk from '../furnishings/desk';
import NightStand from '../furnishings/nightstand';
import Sofa from '../furnishings/sofa';
import BookCase from '../furnishings/bookcase';

export default class MainCanvas extends React.Component {

  componentDidMount() {
    const canvas = document.querySelector("#mc");
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const camera = new THREE.PerspectiveCamera(75,1,0.1,10);
    camera.position.x = -1.0;
    camera.position.y =  1.5;
    camera.position.z = 2.5;

    const light = new THREE.DirectionalLight(0xFFFFFF,1,100);
    light.castShadow = true;
    light.shadow.bias = -0.0002;
    light.position.set(-1,2,4);

    let item = new Sofa({id:null,type:"item",posx:-0.5,posz:-0.5,theta:0.9,params:"",roomId:1,colorName:"red"})
    let scene = Furnishing.doInit(renderer,light);
    item.renderFurnishing(renderer,camera,light,scene);
    
    let animate = t => {
      item.theta += 0.01;
      let scene = Furnishing.doInit(renderer,light);
      item.renderFurnishing(renderer,camera,light,scene);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  render() {
    return ( 
      <div>
        <canvas id="mc" width="800" height="800">Your browser doesn't appear to support HTML5 Canvas.</canvas>
      </div>
    );
  }
}
