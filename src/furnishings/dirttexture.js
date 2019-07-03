import { TextureLoader, MirroredRepeatWrapping } from 'three';

const dirtTexture = new TextureLoader().load("dirt.png");
dirtTexture.wrapS = MirroredRepeatWrapping;
dirtTexture.wrapT = MirroredRepeatWrapping;
dirtTexture.repeat.set(2,2);

export default dirtTexture;
