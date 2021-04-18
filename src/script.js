import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui";

// Texture loader
const loader = new THREE.TextureLoader();
const displacementMap = loader.load("/height7.png");
const map = loader.load("/texture.jpg");
const alphaMap = loader.load("/alpha.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects (actual geometry of the object)
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64);

// Materials (the skin of the object)
const material = new THREE.MeshStandardMaterial({
  color: "gray",
  map,
  displacementMap,
  displacementScale: 0.6,
  alphaMap,
  transparent: true,
  depthTest: false,
//   wireframe: true,
});

// Mesh (object + material)
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.rotation.x = 181;
gui.add(plane.rotation, "x").min(0).max(600);

// Lights
const pointLight = new THREE.PointLight(0x00b3ff, 3);
pointLight.position.x = 0.2;
pointLight.position.y = 10;
pointLight.position.z = 4.4;
scene.add(pointLight);

const pointLightFolder = gui.addFolder("Point Light");

pointLightFolder.add(pointLight.position, "x").min(-3).max(3).step(0.01);
pointLightFolder.add(pointLight.position, "y").min(-6).max(6).step(0.01);
pointLightFolder.add(pointLight.position, "z").min(-3).max(3).step(0.01);
pointLightFolder.add(pointLight, "intensity").min(0).max(10).step(0.01);

const lightColor = {
  color: 0xbbbbbb,
};

pointLightFolder
  .addColor(lightColor, "color")
  .onChange(() => pointLight.color.set(lightColor.color));

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth * 0.7,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth * 0.7;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let mouseY = 0;

const animateTerrain = (e) => {
  mouseY = e.clientY;
};

document.addEventListener("mousemove", animateTerrain);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = 0.3 + 0.0008 * mouseY;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
