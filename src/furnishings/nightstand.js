import Furnishing from "./furnishing"
import { MeshPhongMaterial, Color, BoxGeometry, CylinderGeometry, Mesh } from 'three';
import linesTexture from './linestexture';

export default class NightStand extends Furnishing {
  clone(colors,brighten=false) {
    return new NightStand(this.objVal(),colors,brighten);
  }

  constructor(furnishing,colors,brighten=false) {
    super(furnishing,colors,brighten);
    let scale = 1.5;

    const material = new MeshPhongMaterial({map: linesTexture, color: new Color(this.red/255,this.green/255,this.blue/255)});
    
    const cube = new Mesh( new BoxGeometry(0.3*scale,0.4*scale,0.3*scale),material);
    cube.position.set(0.0,-0.1*scale+1.0*scale,0.0)

    let cylinder1 = new Mesh( new CylinderGeometry( 0.02*scale,0.02*scale,0.6*scale,25 ),
      material ) 
    cylinder1.position.set(-0.13*scale,0.4*scale,0.13*scale)
    
    let cylinder2 = new Mesh( new CylinderGeometry( 0.02*scale,0.02*scale,0.6*scale,25 ),
      material ) 
    cylinder2.position.set(0.13*scale,0.4*scale,0.13*scale)
    
    let cylinder3 = new Mesh( new CylinderGeometry( 0.02*scale,0.02*scale,0.6*scale,25 ),
      material ) 
    cylinder3.position.set(-0.13*scale,0.4*scale,-0.13*scale)

    
    let cylinder4 = new Mesh( new CylinderGeometry( 0.02*scale,0.02*scale,0.6*scale,25 ),
      material )
    cylinder4.position.set(0.13*scale,0.4*scale,-0.13*scale)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
