import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/libs/lil-gui.module.min.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xFFFFFF );
scene.fog = new THREE.Fog( 0xFFFFFF, 20, 80 );

//Camera
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 1, 25 );
camera.lookAt(0,10,10);

//Grid
const grid = new THREE.GridHelper( 200, 100, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
grid.position.y = -10;
scene.add( grid );

//Light
const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

//Windows
const planeGeometry = new THREE.PlaneGeometry( 22, 12 );
const planeMaterial1 = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
const planeMaterial2 = new THREE.MeshPhongMaterial( {color: 0x0000ff, transparent: true, opacity:0.8, side: THREE.DoubleSide} );
const plane1 = new THREE.Mesh( planeGeometry, planeMaterial1 );
const plane2 = new THREE.Mesh( planeGeometry, planeMaterial2 );
const plane3 = new THREE.Mesh( planeGeometry, planeMaterial2 );
scene.add(plane1);
scene.add(plane2);
scene.add(plane3);

//Origin window position
plane1.position.set(0, 3, 0);

//New window position
plane2.position.set(10, 3, 1);
plane3.position.set(-10, 3, 1);

plane2.rotation.y = -Math.PI / 15;
plane3.rotation.y = Math.PI / 15;

plane2.visible = false;
plane3.visible = false;

camera.rotation.order = 'YXZ';
camera.rotation.y = THREE.MathUtils.degToRad(0);

//GUI
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera Position');
const cameraRotationY = { rotationY: 0 };
cameraFolder.add(cameraRotationY, 'rotationY', -20, 20).step(1).name('RotationY').onChange((value) => {
    camera.rotation.y = THREE.MathUtils.degToRad(value);
    if (value === 0) {
        plane2.visible = false;
        plane3.visible = false;
    } else if (value === -20 ) {
        plane2.visible = true;
    } else if (value === 20 ) {
        plane3.visible = true;
    }
});
cameraFolder.open();

const planes = {
    orientation: 'no origin',
    showNewWindow: false
};
const switchFolder = gui.addFolder('Planes Orientation');
switchFolder.add(planes, 'orientation', ['no origin', 'origin']).onChange((value) => {
    if (value === 'no origin') {
        plane2.rotation.y = -Math.PI / 15;
        plane3.rotation.y = Math.PI / 15;
    } else {
        plane2.rotation.y = 0;
        plane3.rotation.y = 0;
    }
});
switchFolder.add(planes, 'showNewWindow').name('Show New Window').onChange((value) => {
    plane2.visible = value;
    camera.rotation.y = value ? 20 : 0;
    camera.rotation.y = THREE.MathUtils.degToRad(cameraRotationY.rotationY);
});
switchFolder.open();

camera.lookAt(plane1.position);

//Control
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom=false;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set( 0, 1, 0 );
controls.update();

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
