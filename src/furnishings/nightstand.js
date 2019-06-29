import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class NightStand extends Furnishing {
  clone(colors,brighten=false) {
    return new NightStand(this.objVal(),colors,brighten);
  }


  constructor(furnishing,colors,brighten=false) {
    super(furnishing,colors,brighten);

    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(this.red/255,this.green/255,this.blue/255)});
    
    const cube = new THREE.Mesh( new THREE.BoxGeometry(0.3,0.4,0.3),material);
    cube.position.set(0.0,-0.1+1.0,0.0)

    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.02,0.02,0.8,25 ),
      material ) 
    cylinder1.position.set(-0.13,-0.5+1,0.13)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.02,0.02,0.8,25 ),
      material ) 
    cylinder2.position.set(0.13,-0.5+1,0.13)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.02,0.02,0.8,25 ),
      material ) 
    cylinder3.position.set(-0.13,-0.5+1,-0.13)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.02,0.02,0.8,25 ),
      material )
    cylinder4.position.set(0.13,-0.5+1,-0.13)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
