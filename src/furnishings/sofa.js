import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class Sofa extends Furnishing {
  constructor(furnishing,colors) {
    super(furnishing,colors);

    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(this.red/255,this.green/255,this.blue/255)});
    
    const cube = new THREE.Mesh( new THREE.BoxGeometry(0.8,0.35,2.5),material);
    cube.position.set(0.0,-0.1+0.6-0.15,0.0)

    let backing = new THREE.Mesh(new THREE.BoxGeometry( 0.2, 0.8, 2.5),material);
    backing.position.set(0.375,1-0.15,0.0)
    backing.rotation.z = -0.2

    let armrest1 = new THREE.Mesh( new THREE.BoxGeometry( 0.6, 0.5, 0.1),material);
    armrest1.position.set(0.0,0.7-0.15,1.2);

    let armrest2 = new THREE.Mesh( new THREE.BoxGeometry( 0.6, 0.5, 0.1),material);
    armrest2.position.set(0.0,0.7-0.15,-1.2);


    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.4,25 ),
      material ) 
    cylinder1.position.set(-0.3,0.2,1.0)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.4,25 ),
      material ) 
    cylinder2.position.set(0.3,0.2,1.0)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.4,25 ),
      material ) 
    cylinder3.position.set(-0.3,0.2,-1.0)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1,0.1,0.4,25 ),
      material )
    cylinder4.position.set(0.3,0.2,-1.0)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
    this.threeDimMeshes.push(backing);
    this.threeDimMeshes.push(armrest1);
    this.threeDimMeshes.push(armrest2);
  }
}
