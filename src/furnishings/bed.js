import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class Bed extends Furnishing {
  constructor(furnishing) {
    super(furnishing);

    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    
    let scale = 0.9;

    const cube = new THREE.Mesh( new THREE.BoxGeometry(2*scale,0.75*scale,2.5*scale),material);
    cube.position.set(0.0,-0.1*scale+0.8*scale,0.0)

    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder1.position.set(-0.9*scale,-0.5*scale+1*scale,1.1*scale)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder2.position.set(0.9*scale,-0.5*scale+1*scale,1.1*scale)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder3.position.set(-0.9*scale,-0.5*scale+1*scale,-1.1*scale)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material )
    cylinder4.position.set(0.9*scale,-0.5*scale+1*scale,-1.1*scale)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
