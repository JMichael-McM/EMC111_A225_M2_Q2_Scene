import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

const textureLoader = new THREE.TextureLoader();

const wallTexture = textureLoader.load('textures/plastered_stone_wall.jpg');
const floorTexture = textureLoader.load('textures/concrete_floor_02.jpg');
const ceilingTexture = textureLoader.load('textures/ceiling_interior.jpg');

const textureRepeatX = 1; 
const textureRepeatY = 15; 

wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;

floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;

ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;

const materialColor = 0x333333; 

const corridorWallMaterial = new THREE.MeshPhongMaterial({ 
    color: materialColor, 
    shininess: 5,
    map: wallTexture, 
}); 
const corridorFloorMaterial = new THREE.MeshPhongMaterial({ 
    color: materialColor, 
    shininess: 5,
    map: floorTexture, 
}); 
const endWallMaterial = new THREE.MeshPhongMaterial({ color: 0x550000, shininess: 5 }); 
const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x1a0000, shininess: 5 }); 
const figureMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true }); 
const flashlightMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 5 }); 

const ceilingMaterial = new THREE.MeshPhongMaterial({ 
    color: materialColor, 
    shininess: 5,
    map: ceilingTexture, 
}); 

const corridorLength = 30;
const corridorWidth = 5;
const corridorHeight = 6;

const corridorBaseGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
const floorUvs = corridorBaseGeometry.attributes.uv.array;
for (let i = 0; i < floorUvs.length; i += 2) {
    floorUvs[i] *= textureRepeatX;
    floorUvs[i + 1] *= textureRepeatY;
}
corridorBaseGeometry.attributes.uv.needsUpdate = true; 

const corridorBase = new THREE.Mesh(corridorBaseGeometry, corridorFloorMaterial); 
corridorBase.rotation.x = -Math.PI / 2;
corridorBase.receiveShadow = true;
corridorBase.position.z = -corridorLength / 2;
scene.add(corridorBase);

const wallPlaneGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);

const wallPlaneUvs = wallPlaneGeo.attributes.uv.array;
for (let i = 0; i < wallPlaneUvs.length; i += 2) {
    wallPlaneUvs[i] *= textureRepeatY; 
    wallPlaneUvs[i + 1] *= textureRepeatX; 
}
wallPlaneGeo.attributes.uv.needsUpdate = true;

const wallLeft = new THREE.Mesh(wallPlaneGeo, corridorWallMaterial); 
wallLeft.rotation.y = Math.PI / 2; 
wallLeft.position.set(-corridorWidth / 2, corridorHeight / 2, -corridorLength / 2); 
wallLeft.castShadow = true;
wallLeft.receiveShadow = true;
scene.add(wallLeft); 

const wallRight = new THREE.Mesh(wallPlaneGeo, corridorWallMaterial); 
wallRight.rotation.y = -Math.PI / 2; 
wallRight.position.set(corridorWidth / 2, corridorHeight / 2, -corridorLength / 2);
wallRight.castShadow = true;
wallRight.receiveShadow = true;
scene.add(wallRight);

const ceilingGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength); 

const ceilingUvs = ceilingGeometry.attributes.uv.array;
for (let i = 0; i < ceilingUvs.length; i += 2) {
    ceilingUvs[i] *= textureRepeatX;
    ceilingUvs[i + 1] *= textureRepeatY;
}
ceilingGeometry.attributes.uv.needsUpdate = true;

const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial); 
ceiling.rotation.x = Math.PI / 2; 
ceiling.position.set(0, corridorHeight, -corridorLength / 2);
scene.add(ceiling);

const endWallGeo = new THREE.PlaneGeometry(corridorWidth, corridorHeight);
const endWall = new THREE.Mesh(endWallGeo, endWallMaterial);
endWall.position.set(0, corridorHeight / 2, -corridorLength); 
endWall.receiveShadow = true;
scene.add(endWall);

const figureGroup = new THREE.Group();
const figureZPos = -corridorLength + 2;
const figureBaseY = 0;

const legHeight = 3.0; 
const legWidth = 0.7; 
const legDepth = 0.7; 
const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth); 
const legHorizontalOffset = 0.45; 

const legL = new THREE.Mesh(legGeometry, figureMaterial);
legL.position.set(-legHorizontalOffset, figureBaseY + legHeight / 2, 0);
legL.castShadow = true;
figureGroup.add(legL);

const legR = new THREE.Mesh(legGeometry, figureMaterial);
legR.position.set(legHorizontalOffset, figureBaseY + legHeight / 2, 0);
legR.castShadow = true;
figureGroup.add(legR);

const newTorsoHeight = 2.0; 
const torsoWidth = 1.2; 
const torsoDepth = 0.8; 
const torsoGeometry = new THREE.BoxGeometry(torsoWidth, newTorsoHeight, torsoDepth);
const newTorsoCenterY = figureBaseY + newTorsoHeight / 2 + legHeight / 2; 
const torso = new THREE.Mesh(torsoGeometry, figureMaterial);
torso.position.set(0, newTorsoCenterY, 0); 
torso.castShadow = true;
figureGroup.add(torso);

const headRadius = 0.5; 
const headGeometry = new THREE.SphereGeometry(headRadius, 8, 8); 
const head = new THREE.Mesh(headGeometry, figureMaterial);
head.position.set(0, newTorsoCenterY + newTorsoHeight / 2 + headRadius, 0);
head.castShadow = true;
figureGroup.add(head);

const armHeight = 1.7; 
const armWidth = 0.5; 
const armDepth = 0.5; 
const armGeometry = new THREE.BoxGeometry(armWidth, armHeight, armDepth);
const armHorizontalOffset = 0.8; 
const armZOffset = torsoDepth / 2 - armDepth / 4; 

const armL = new THREE.Mesh(armGeometry, figureMaterial);
armL.position.set(-armHorizontalOffset, newTorsoCenterY, armZOffset); 
armL.castShadow = true;
figureGroup.add(armL);

const armR = new THREE.Mesh(armGeometry, figureMaterial);
armR.position.set(armHorizontalOffset, newTorsoCenterY, armZOffset); 
armR.castShadow = true;
figureGroup.add(armR);


figureGroup.position.set(0, 0, figureZPos); 
scene.add(figureGroup);

const redLight = new THREE.PointLight(0x880000, 1.0, 30); 
redLight.position.set(0, corridorHeight - 0.1, -corridorLength + 4); 
redLight.castShadow = true;
redLight.shadow.mapSize.width = 2048; 
redLight.shadow.mapSize.height = 2048;
redLight.shadow.bias = -0.0005; 
scene.add(redLight);

const silhouetteLight = new THREE.PointLight(0xff0000, 5.0, 10); 
silhouetteLight.position.set(0, 3, -corridorLength + 3); 
scene.add(silhouetteLight);

const frontRedLight = new THREE.PointLight(0x880000, 2.5, 18); 
frontRedLight.position.set(0, corridorHeight - 0.1, -corridorLength / 2); 
frontRedLight.castShadow = true;
scene.add(frontRedLight);

const brightFillLight = new THREE.PointLight(0xffffff, 5.0, 15); 
brightFillLight.position.set(0, 4, 1.5); 
brightFillLight.castShadow = true;
scene.add(brightFillLight);

const flashlight = new THREE.SpotLight(0xffaa00, 0.5, 10, Math.PI / 8, 0.5, 1); 
const flashlightX = -1.0;
const flashlightZ = 1.0;
const flashlightY = 0.1; 
flashlight.position.set(flashlightX, flashlightY, flashlightZ); 
flashlight.target.position.set(0, flashlightY, -8); 
flashlight.castShadow = true;
flashlight.shadow.mapSize.width = 1024;
flashlight.shadow.mapSize.height = 1024;
flashlight.shadow.bias = -0.001; 
scene.add(flashlight);
scene.add(flashlight.target);


const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.1);
scene.add(ambientLight);

let flickerTime = 0;
const clock = new THREE.Clock();


camera.position.set(0, 2.5, 2); 
camera.lookAt(0, corridorHeight / 2, -corridorLength / 2); 


function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    flickerTime += delta;
    
    const redIntensity = 0.8 + 0.2 * Math.sin(flickerTime * 4) + 0.1 * Math.sin(flickerTime * 6 + Math.random());
    redLight.intensity = Math.max(0.2, Math.min(1.5, redIntensity)); 

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

animate();
