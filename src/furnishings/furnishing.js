import * as THREE from 'three';


function squareRoot255(val) {
  return 255*Math.sqrt(val/255);
}

export default class Furnishing {
  constructor(furnishing,colors, brighten = false) {
    this.id = furnishing.id;
    this.type = furnishing.type;
    this.posx = furnishing.posx;
    this.posz = furnishing.posz;
    this.theta = furnishing.theta;
    this.params = furnishing.params;
    this.roomId = furnishing.roomId;
    this.colorName = furnishing.colorName;
    this.clones = []
    if(colors && colors[this.colorName]) {
      if(brighten) {
        this.red = squareRoot255(colors[this.colorName].red);
        this.green = squareRoot255(colors[this.colorName].green);
        this.blue = squareRoot255(colors[this.colorName].blue);
      } else {
        this.red = colors[this.colorName].red;
        this.green = colors[this.colorName].green;
        this.blue = colors[this.colorName].blue;
      }
    }
    this.threeDimMeshes = []; // fill out in subclasses
  }

  objVal() {
    let retVal = {id:this.id, type:this.type, posx:this.posx, posz:this.posz, 
      theta:this.theta, params:this.params, roomId: this.roomId, colorName: this.colorName };
    return retVal;
  }

  static doInit(renderer,light,camera) {
    renderer.renderLists.dispose();
    var scene = new THREE.Scene();
    scene.add(light);
    renderer.render(scene,camera);
    return scene;
  }

  checkIntersect(raycaster) {
    let intersections = raycaster.intersectObjects(this.clones,true);
    if(intersections.length > 0) {
      var dist = intersections[0].distance;
      intersections.forEach( intersection => {
        if(intersection.distance < dist) {
          dist = intersection.distance;
        }
      });
      return dist;
    }
    return -1;
  }

  renderFurnishing(renderer,camera,light,scene) {
    var rotateMat = new THREE.Matrix4();
    rotateMat.makeRotationY(this.theta);
    var translateMat = new THREE.Matrix4();
    translateMat.makeTranslation(this.posx,0,this.posz);
    this.clones = []
    
    this.threeDimMeshes.forEach( mesh => {
      var cloneMesh = mesh.clone();
      cloneMesh.castShadow = true;
      cloneMesh.receiveShadow = true;
      cloneMesh.applyMatrix(rotateMat);
      cloneMesh.applyMatrix(translateMat);
      scene.add(cloneMesh);
      this.clones.push(cloneMesh);
    });

    renderer.render(scene,camera);
    return scene;
  }
}
