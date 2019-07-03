import { TextureLoader, MirroredRepeatWrapping } from 'three';

const linesTexture = new TextureLoader().load("lines.png");
linesTexture.wrapS = MirroredRepeatWrapping;
linesTexture.wrapT = MirroredRepeatWrapping;
linesTexture.repeat.set(2,2);

export default linesTexture;
