import * as THREE from 'three';


export default class Furnishing {
  constructor(furnishing) {
    this.id = furnishing.id;
    this.type = furnishing.type;
    this.posx = furnishing.posx;
    this.posy = furnishing.posy;
    this.theta = furnishing.theta;
    this.params = furnishing.params;
    this.roomId = furnishing.roomId;
    this.colorName = furnishing.colorName;
    this.threeDimMeshes = []; // fill out in subclasses
  }

  objVal() {
    let retVal = {id:this.id, type:this.type, posx:this.posx, posy:this.posy, 
      theta:this.theta, params:this.params, roomId: this.roomId, colorName: this.colorName };
    return retVal;
  }

  renderFurnishing(renderer,scene,camera) {
    var rotateMat = new THREE.Matrix4();
    rotateMat.makeRotationY(this.theta);
    var translateMat = new THREE.Matrix4();
    translateMat.makeTranslation(this.posx,this.posy,0);
    renderer.renderLists.dispose();
    scene.dispose();
    
    this.threeDimMeshes.forEach( mesh => {
      var cloneMesh = mesh.clone();
      cloneMesh.applyMatrix(rotateMat);
      cloneMesh.applyMatrix(translateMat);
      scene.add(cloneMesh);
    });

    renderer.render(scene,camera);
  }
}
