import Furnishing from "./furnishing"
import { MeshPhongMaterial, Color, BoxGeometry, CylinderGeometry, Mesh } from 'three';
import dirtTexture from './dirttexture';

export default class Stool extends Furnishing {

  clone(colors,brighten=false) {
    return new Stool(this.objVal(),colors,brighten);
  }

  constructor(furnishing,colors,brighten=false) {
    super(furnishing,colors,brighten);

    const material = new MeshPhongMaterial({bumpMap: dirtTexture, color: new Color(this.red/255,this.green/255,this.blue/255)});
    
    var scale = 0.8;
    const cube = new Mesh( new BoxGeometry(scale*1,scale*0.1,scale*1),material);
    cube.position.set(scale*0.0,scale*(-0.1)+scale,scale*0.0)

    let cylinder1 = new Mesh( new CylinderGeometry( scale*0.1,scale*0.1,scale*0.8,25 ),
      material ) 
    cylinder1.position.set(-0.5*scale,-0.5*scale+scale,0.5*scale)
    cylinder1.rotation.x = -0.25
    cylinder1.rotation.z = -0.25
    
    let cylinder2 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder2.position.set(0.5*scale,-0.5*scale+scale,0.5*scale)
    cylinder2.rotation.x = -0.25
    cylinder2.rotation.z = 0.25

    let cylinder3 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material ) 
    cylinder3.position.set(-0.5*scale,-0.5*scale+scale,-0.5*scale)
    cylinder3.rotation.x = 0.25
    cylinder3.rotation.z = -0.25
    
    let cylinder4 = new Mesh( new CylinderGeometry( 0.1*scale,0.1*scale,0.8*scale,25 ),
      material )
    cylinder4.position.set(0.5*scale,-0.5*scale+scale,-0.5*scale)
    cylinder4.rotation.x = 0.25
    cylinder4.rotation.z = 0.25
    
    this.threeDimMeshes.push(cube);
    this.threeDimMeshes.push(cylinder1);
    this.threeDimMeshes.push(cylinder2);
    this.threeDimMeshes.push(cylinder3);
    this.threeDimMeshes.push(cylinder4);
  }
}
