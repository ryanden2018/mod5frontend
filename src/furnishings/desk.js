import Furnishing from "./furnishing"
import { MeshPhongMaterial, Color, BoxGeometry, CylinderGeometry, Mesh } from 'three';
import linesTexture from './linestexture';

export default class Desk extends Furnishing {

  clone(colors, brighten = false) {
    return new Desk(this.objVal(),colors, brighten);
  }

  constructor(furnishing,colors,brighten = false) {
    super(furnishing,colors,brighten);

    const material = new MeshPhongMaterial({map: linesTexture, color: new Color(this.red/255,this.green/255,this.blue/255)});
    var scale = 1.3;
    
    const cube = new Mesh( new BoxGeometry(1.75*scale,0.5*scale,0.9*scale),material);
    cube.position.set(0.0,-0.1*scale+1.0*scale,0.0)

    let cylinder1 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.65*scale,25 ),
      material ) 
    cylinder1.position.set(-0.75*scale,0.425*scale,0.3*scale)
    
    let cylinder2 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.65*scale,25 ),
      material ) 
    cylinder2.position.set(0.75*scale,0.425*scale,0.3*scale)
    
    let cylinder3 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.65*scale,25 ),
      material ) 
    cylinder3.position.set(-0.75*scale,0.425*scale,-0.3*scale)

    
    let cylinder4 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.65*scale,25 ),
      material )
    cylinder4.position.set(0.75*scale,0.425*scale,-0.3*scale)

    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
