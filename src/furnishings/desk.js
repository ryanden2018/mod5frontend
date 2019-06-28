import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class Desk extends Furnishing {
  constructor(furnishing) {
    super(furnishing);

    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    
    const cube = new THREE.Mesh( new THREE.BoxGeometry(1.75,0.5,0.9),material);
    cube.position.set(0.0,-0.1+1.0,0.0)

    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.8,25 ),
      material ) 
    cylinder1.position.set(-0.75,-0.5+1,0.3)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.8,25 ),
      material ) 
    cylinder2.position.set(0.75,-0.5+1,0.3)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.8,25 ),
      material ) 
    cylinder3.position.set(-0.75,-0.5+1,-0.3)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.8,25 ),
      material )
    cylinder4.position.set(0.75,-0.5+1,-0.3)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
