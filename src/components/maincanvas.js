import React from 'react';
import '../App.css';
import * as THREE from 'three';
import Table from '../furnishings/table';

export default class MainCanvas extends React.Component {

  componentDidMount() {
    const canvas = document.querySelector("#mc");
    const renderer = new THREE.WebGLRenderer({canvas});
    const camera = new THREE.PerspectiveCamera(75,1,0.1,5);
    camera.position.x = 0.0;
    camera.position.y = 0.0;
    camera.position.z = 2.5;

    const light = new THREE.DirectionalLight(0xFFFFFF,1);
    light.position.set(-1,2,4);

    let table = new Table({id:null,type:"table",posx:-0.5,posz:-0.5,theta:0.3,params:"",roomId:1,colorName:"red"})
    table.renderFurnishing(renderer,camera,light);

    // var repeater = t => {
    //   table.renderFurnishing(renderer,camera,light);
    //   table.posx += 0.0025;
    //   table.posz += 0.0025;
    //   table.theta += 0.01;

    //   requestAnimationFrame(repeater)
    // }

    // requestAnimationFrame(repeater)
  }

  render() {
    return ( 
      <div>
        <canvas id="mc" width="800" height="800">Your browser doesn't appear to support HTML5 Canvas.</canvas>
      </div>
    );
  }
}
