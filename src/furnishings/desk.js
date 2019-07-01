import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class Desk extends Furnishing {

  clone(colors, brighten = false) {
    return new Desk(this.objVal(),colors, brighten);
  }

  constructor(furnishing,colors,brighten = false) {
    super(furnishing,colors,brighten);

    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(this.red/255,this.green/255,this.blue/255)});
    var scale = 1.25;
    
    const cube = new THREE.Mesh( new THREE.BoxGeometry(1.75*scale,0.5*scale,0.9*scale),material);
    cube.position.set(0.0,-0.1*scale+1.0*scale,0.0)

    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder1.position.set(-0.75*scale,-0.5*scale+1*scale,0.3*scale)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder2.position.set(0.75*scale,-0.5*scale+1*scale,0.3*scale)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder3.position.set(-0.75*scale,-0.5*scale+1*scale,-0.3*scale)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material )
    cylinder4.position.set(0.75*scale,-0.5*scale+1*scale,-0.3*scale)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
