import Furnishing from "./furnishing"
import * as THREE from 'three';

export default class BookCase extends Furnishing {

  clone(colors,brighten = false) {
    return new BookCase(this.objVal(),colors,brighten);
  }

  constructor(furnishing,colors,brighten = false) {
    super(furnishing,colors,brighten);

    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(this.red/255,this.green/255,this.blue/255)});
    
    const box1 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box1.position.set(0.0,0.05,0.0)

    const box2 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box2.position.set(0.0,0.05+0.49,0.0)
    
    const box3 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box3.position.set(0.0,0.05+2*0.49,0.0)

    const box4 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box4.position.set(0.0,0.05+3*0.49,0.0)

    const box5 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box5.position.set(0.0,0.05+4*0.49,0.0)

    const box6 = new THREE.Mesh( new THREE.BoxGeometry(1.2,0.1,0.9),material);
    box6.position.set(0.0,0.05+5*0.49,0.0)

    const box7 = new THREE.Mesh( new THREE.BoxGeometry(1.2,5*0.49+0.1,0.1),material);
    box7.position.set(0.0,2.5*0.49+0.05,-0.4)
    
    const box8 = new THREE.Mesh( new THREE.BoxGeometry(0.1,5*0.49+0.1,0.9),material);
    box8.position.set(-0.58,2.5*0.49+0.05,0.0)

    const box9 = new THREE.Mesh( new THREE.BoxGeometry(0.1,5*0.49+0.1,0.9),material);
    box9.position.set(0.58,2.5*0.49+0.05,0.0)

    this.threeDimMeshes.push(box1);
    this.threeDimMeshes.push(box2);
    this.threeDimMeshes.push(box3);
    this.threeDimMeshes.push(box4);
    this.threeDimMeshes.push(box5);
    this.threeDimMeshes.push(box6);
    this.threeDimMeshes.push(box7);
    this.threeDimMeshes.push(box8);
    this.threeDimMeshes.push(box9);
  }
}
