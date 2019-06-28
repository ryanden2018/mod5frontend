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

export default class MainCanvas extends React.Component {

  componentDidMount() {
    const canvas = document.querySelector("#mc");
    const renderer = new THREE.WebGLRenderer({canvas});
    const camera = new THREE.PerspectiveCamera(75,1,0.1,10);
    camera.position.x = -1.0;
    camera.position.y =  1.5;
    camera.position.z = 2.5;

    const light = new THREE.DirectionalLight(0xFFFFFF,1);
    light.position.set(-1,2,4);

    let sofa = new Sofa({id:null,type:"sofa",posx:-0.5,posz:-0.5,theta:0.9,params:"",roomId:1,colorName:"red"})
    let chair = new Chair({id:null,type:"chair",posx:-2.0,posz:0.0,theta:0.9,params:"",roomId:1,colorName:"red"})
    
    let scene = Furnishing.doInit(renderer,light);
    sofa.renderFurnishing(renderer,camera,light,scene);
    chair.renderFurnishing(renderer,camera,light,scene);
  }

  render() {
    return ( 
      <div>
        <canvas id="mc" width="800" height="800">Your browser doesn't appear to support HTML5 Canvas.</canvas>
      </div>
    );
  }
}
