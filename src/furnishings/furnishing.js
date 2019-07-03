import { Matrix4, Scene, MeshPhongMaterial, Color } from 'three';


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

  fillColor = () => {
    if(this.threeDimMeshes.length > 0) {
      let texture = this.threeDimMeshes[0].material.map;
      this.threeDimMeshes[0].material.dispose();
      let material = new MeshPhongMaterial({map: texture, color: new Color(this.red/255,this.green/255,this.blue/255)});
      this.threeDimMeshes.forEach( thisMesh => {
        thisMesh.material = material;
      });
    }
  }

  objVal() {
    let retVal = {id:this.id, type:this.type, posx:this.posx, posz:this.posz, 
      theta:this.theta, params:this.params, roomId: this.roomId, colorName: this.colorName };
    return retVal;
  }

  updateFromObject(obj,colors) {
    this.id = obj.id;
    this.type = obj.type;
    this.posx = obj.posx;
    this.posz = obj.posz;
    this.theta = obj.theta;
    this.params = obj.params;
    this.roomId = obj.roomId;
    this.colorName = obj.colorName;
    if(colors && colors[this.colorName]) {
      this.red = colors[this.colorName].red;
      this.green = colors[this.colorName].green;
      this.blue = colors[this.colorName].blue;
    }
  }

  static doInit(renderer,light,camera) {
    renderer.renderLists.dispose();
    var scene = new Scene();
    scene.add(light);
    renderer.render(scene,camera);
    return scene;
  }

  checkIntersect(raycaster) {
    let intersections = raycaster.intersectObjects(this.threeDimMeshes,true);
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

  dispose = () => {
    while(this.threeDimMeshes.length > 0) {
      var thisMesh = this.threeDimMeshes.pop();
      thisMesh.geometry.dispose();
      thisMesh.material.dispose();
    }
  }


  moveX(diffX) {
    let translateMat = new Matrix4();
    translateMat.makeTranslation(diffX,0,0);
    this.threeDimMeshes.forEach( thisMesh => {
      thisMesh.applyMatrix(translateMat);
    });
    this.posx += diffX;
  }

  moveZ(diffZ) {
    let translateMat = new Matrix4();
    translateMat.makeTranslation(0,0,diffZ);
    this.threeDimMeshes.forEach( thisMesh => {
      thisMesh.applyMatrix(translateMat);
    });
    this.posz += diffZ;
  }

  moveTheta(diffTheta) {
    let invTranslateMat = new Matrix4();
    let translateMat = new Matrix4();
    let rotateMat = new Matrix4();
    translateMat.makeTranslation(this.posx,0,this.posz);
    invTranslateMat.makeTranslation(-this.posx,0,-this.posz);
    rotateMat.makeRotationY(diffTheta);
    this.threeDimMeshes.forEach( thisMesh => {
      thisMesh.applyMatrix(invTranslateMat);
      thisMesh.applyMatrix(rotateMat);
      thisMesh.applyMatrix(translateMat);
    });
    this.theta += diffTheta;
  }


  removeFrom = (scene) => {
    this.threeDimMeshes.forEach( thisMesh => {
      scene.remove(thisMesh);
    });
  }

  renderFurnishing(renderer,camera,scene) {
    let rotateMat = new Matrix4();
    rotateMat.makeRotationY(this.theta);
    let translateMat = new Matrix4();
    translateMat.makeTranslation(this.posx,0,this.posz);
  
    this.threeDimMeshes.forEach( thisMesh => {
      thisMesh.castShadow = true;
      thisMesh.receiveShadow = true;
      thisMesh.applyMatrix(rotateMat);
      thisMesh.applyMatrix(translateMat);
      scene.add(thisMesh);
    });

    renderer.render(scene,camera);
    return scene;
  }
}
