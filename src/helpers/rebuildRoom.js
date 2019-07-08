import { DoubleSide,Mesh,PlaneGeometry,MeshPhongMaterial } from 'three';
import Furnishing from '../furnishings/furnishing';

export default function rebuildRoom() {
  if(this.renderer && this.light && this.camera) {
    this.removeTransients();
    this.tossGarbage();
    this.disposeAllFurnishings();


    this.scene = Furnishing.doInit(this.renderer,this.light,this.camera);

    if(!this.state.overheadView) {
      this.camera.position.x = 0.0 + this.state.cameraDispX;
      this.camera.position.y =  this.props.roomProperties.height * 0.5;
      this.camera.position.z = 0.9*this.props.roomProperties.width/2+ this.state.cameraDispZ;
      this.camera.rotation.x = 0.0;
      this.camera.rotation.y = 0.0 + this.state.cameraRotDispY;
      this.camera.rotation.z = 0.0;
    } else {
      this.camera.position.x = 0.0;
      this.camera.position.y = this.props.roomProperties.width*0.95;
      this.camera.position.z = 0.0;
      this.camera.rotation.x = -Math.PI/2;
      this.camera.rotation.y = 0.0;
      this.camera.rotation.z = 0.0;
    }
    this.light.castShadow = true;
    this.light.shadow.bias = -0.0002;
    this.light.position.set(0,0.9*this.props.roomProperties.height, 0*0.9*this.props.roomProperties.length / 2);
    this.floor = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
      new MeshPhongMaterial({color:"white",side:DoubleSide}) );
    this.floor.receiveShadow = true;
    this.floor.castShadow = true;
    this.floor.rotation.x = Math.PI/2;
    this.floor.position.y = 0.15;
    this.ceiling = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.length),
      new MeshPhongMaterial({color:"white"}) );
    this.ceiling.receiveShadow = true;
    this.ceiling.castShadow = true;
    this.ceiling.rotation.x = Math.PI/2;
    this.ceiling.position.set(0,this.props.roomProperties.height,0);
    this.wallLeft = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
      new MeshPhongMaterial({color:"white"}) );
    this.wallLeft.receiveShadow = true;
    this.wallLeft.castShadow = true;
    this.wallLeft.rotation.y = 1.0*Math.PI/2;
    this.wallLeft.position.set(-this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
    this.wallRight = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
      new MeshPhongMaterial({color:"white"}) );
    this.wallRight.receiveShadow = true;
    this.wallRight.castShadow = true;
    this.wallRight.rotation.y = -1.0*Math.PI/2;
    this.wallRight.position.set(this.props.roomProperties.width/2, this.props.roomProperties.height/2, 0);
    this.wallBack = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
      new MeshPhongMaterial({color:"white"}) );
    this.wallBack.receiveShadow = true;
    this.wallBack.castShadow= true;
    this.wallBack.position.set(0, this.props.roomProperties.height/2, -this.props.roomProperties.length/2);
    this.wallFront = new Mesh(
      new PlaneGeometry(this.props.roomProperties.width, this.props.roomProperties.height),
      new MeshPhongMaterial({color:"white"}) );
    this.wallFront.rotation.y = Math.PI;
    this.wallFront.receiveShadow = true;
    this.wallFront.castShadow = true;
    this.wallFront.position.set(0, this.props.roomProperties.height/2, this.props.roomProperties.length/2);
    
    this.scene.add(this.floor);
    this.scene.add(this.wallLeft);
    this.scene.add(this.wallRight);
    this.scene.add(this.wallBack);
    this.scene.add(this.ceiling);
    this.scene.add(this.wallFront);
    this.scene.add(this.ambientLight);
    this.renderer.render(this.scene,this.camera)
  }
}