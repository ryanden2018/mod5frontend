import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class Sofa extends Furnishing {

  clone(colors,brighten=false) {
    return new Sofa(this.objVal(),colors,brighten);
  }

  constructor(furnishing,colors,brighten=false) {
    super(furnishing,colors,brighten);

    let scale = 1.45;
    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(this.red/255,this.green/255,this.blue/255)});
    
    const cube = new THREE.Mesh( new THREE.BoxGeometry(0.8*scale,0.35*scale,2.5*scale),material);
    cube.position.set(0.0,-0.1*scale+0.6*scale-0.15*scale,0.0)

    let backing = new THREE.Mesh(new THREE.BoxGeometry( 0.2*scale, 0.8*scale, 2.5*scale),material);
    backing.position.set(0.375*scale,1*scale-0.15*scale,0.0)
    backing.rotation.z = -0.2

    let armrest1 = new THREE.Mesh( new THREE.BoxGeometry( 0.6*scale, 0.5*scale, 0.1*scale),material);
    armrest1.position.set(0.0,0.7*scale-0.15*scale,1.2*scale);

    let armrest2 = new THREE.Mesh( new THREE.BoxGeometry( 0.6*scale, 0.5*scale, 0.1*scale),material);
    armrest2.position.set(0.0,0.7*scale-0.15*scale,-1.2*scale);


    let cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.4*scale,25 ),
      material ) 
    cylinder1.position.set(-0.3*scale,0.2*scale,1.0*scale)
    
    let cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.4*scale,25 ),
      material ) 
    cylinder2.position.set(0.3*scale,0.2*scale,1.0*scale)
    
    let cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.4*scale,25 ),
      material ) 
    cylinder3.position.set(-0.3*scale,0.2*scale,-1.0*scale)

    
    let cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 0.1*scale,0.1*scale,0.4*scale,25 ),
      material )
    cylinder4.position.set(0.3*scale,0.2*scale,-1.0*scale)

    
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
