import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.144.0/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.144.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.144.0/examples/jsm/geometries/TextGeometry.js";

//initiera en scen
const scene = new THREE.Scene();

let torus,
  camera,
  controls = undefined;
let activeSlide = 0;

const cameraSliderPosition = {
  ry: undefined,
  rx: undefined,
  px: undefined,
  pz: undefined,
};
const cameraFinalPosition = {
  ry: undefined,
  rx: undefined,
  px: undefined,
  pz: undefined,
};

const NUMBER_OF_SLIDES = 14;
//Högre är långsammare
const SLIDER_ANIMATION_SPEED = 50;

//text
const activeSlideText = document.querySelector(".active-slide")
activeSlideText.textContent = activeSlide + 1 + "/" + NUMBER_OF_SLIDES;

//buttons and eventlisteners
const parallelButton = document.querySelector(".parallel");
parallelButton.addEventListener("click", parallelKamera);

const teleskopButton = document.querySelector(".tele");
teleskopButton.addEventListener("click", teleskopKamera);

const standardButton = document.querySelector(".standard");
standardButton.addEventListener("click", standardKamera);

const vidButton = document.querySelector(".vid");
vidButton.addEventListener("click", vidvinkelKamera);

const nextButton = document.querySelector(".next");
nextButton.addEventListener("click", nextSlide);

const prevButton = document.querySelector(".prev");
prevButton.addEventListener("click", prevSlide);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function parallelKamera() {
  const viewSize = 80;
  camera = new THREE.OrthographicCamera(
    ((-window.innerWidth / window.innerHeight) * viewSize) / 2,

    ((window.innerWidth / window.innerHeight) * viewSize) / 2,

    viewSize / 2,
    -viewSize / 2,
    -30,
    50000
  );
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
}

function teleskopKamera() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.position.setZ(80);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
}

function standardKamera() {
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.position.setZ(50);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
}

function vidvinkelKamera() {
  camera = new THREE.PerspectiveCamera(
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.position.setZ(25);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
}

function addSphere(color, x, y, z, size) {
  const sGeometry = new THREE.SphereGeometry(size, 15, 15);

  const material = new THREE.MeshStandardMaterial({
    color: color,
  });
  const sphere = new THREE.Mesh(sGeometry, material);

  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  scene.add(sphere);
}

function addBox(color, x, y, z, size) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color: color,
  });
  const box = new THREE.Mesh(geometry, material);
  box.position.x = x;
  box.position.y = y;
  box.position.z = z;
  scene.add(box);
}

function addSlide(index) {
  const slideGeometry = new THREE.PlaneGeometry(18, 10);
  const slideTexture = new THREE.TextureLoader().load(
    "./Slides/" + index + ".png"
  );
  const slideMaterial = new THREE.MeshBasicMaterial({ map: slideTexture });
  const slide = new THREE.Mesh(slideGeometry, slideMaterial);
  slide.rotation.y = index * ((2 * Math.PI) / NUMBER_OF_SLIDES);
  slide.position.x = 80 * Math.sin(index * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  slide.position.z = 80 * Math.cos(index * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  scene.add(slide);
}

function addTorus() {
  const geometry = new THREE.TorusGeometry(25, 1, 8, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0x000088,
  });
  torus = new THREE.Mesh(geometry, material);
  scene.add(torus);
}

function drawText() {
  const fLoader = new FontLoader();

  fLoader.load(
    "./RobotoFile/Roboto_Bold_Changed_To_JSON.json",
    function (font) {
      const tGeometry = new TextGeometry("Albin Johansson", {
        font: font,
        size: 4,
        height: 1,
      });

      const textMesh = new THREE.Mesh(tGeometry, [
        new THREE.MeshPhongMaterial({ color: 0xbb9900 }),
        new THREE.MeshPhongMaterial({ color: 0xbb9900 }),
      ]);
      textMesh.castShadow = true;
      textMesh.position.y = -1.5;
      textMesh.position.x = -22;
      textMesh.position.z = -1;
      scene.add(textMesh);
    }
  );
}

function addStar() {
  const geometry = new THREE.SphereGeometry(15, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffeeee });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100000));

  star.position.set(x, y, z);
  scene.add(star);
}

function addPointLight(color, intensity, x, y, z) {
  const pointLight = new THREE.PointLight(0xffffff, 10, 200, 10);
  pointLight.position.set(20, 20, 20);
  scene.add(pointLight);
}

function addAmbiantLight(color, intensity) {
  const ambientLight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientLight);
}

function nextSlide() {
  cameraSliderPosition.ry = activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES);
  cameraSliderPosition.rx = (2 * Math.PI) / 2;
  cameraSliderPosition.px =
    87 * Math.sin(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  cameraSliderPosition.pz =
    87 * Math.cos(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));

  activeSlide += 1;
  activeSlideText.textContent = activeSlide%NUMBER_OF_SLIDES + 1 + "/" + NUMBER_OF_SLIDES;

  cameraFinalPosition.ry = activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES);
  cameraFinalPosition.rx = (2 * Math.PI) / 2;
  cameraFinalPosition.px =
    87 * Math.sin(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  cameraFinalPosition.pz =
    87 * Math.cos(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
}

function prevSlide() {
  cameraSliderPosition.ry = activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES);
  cameraSliderPosition.rx = (2 * Math.PI) / 2;
  cameraSliderPosition.px = 
    87 * Math.sin(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  cameraSliderPosition.pz =
    87 * Math.cos(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));

  activeSlide -= 1;
  if(activeSlide < 1) activeSlide = NUMBER_OF_SLIDES;
  activeSlideText.textContent = activeSlide%NUMBER_OF_SLIDES + 1 + "/" + NUMBER_OF_SLIDES;

  cameraFinalPosition.ry = activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES);
  cameraFinalPosition.rx = (2 * Math.PI) / 2;
  cameraFinalPosition.px =
    87 * Math.sin(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
  cameraFinalPosition.pz =
    87 * Math.cos(activeSlide * ((2 * Math.PI) / NUMBER_OF_SLIDES));
}

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == "38") {
    return;
  } else if (e.keyCode == "40") {
    return;
  } else if (e.keyCode == "37") {
    prevSlide();
  } else if (e.keyCode == "39") {
    nextSlide();
  }
}

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.008;
  torus.rotation.y += 0.009;
  torus.rotation.z += 0.01;

  if (cameraSliderPosition.px - 0.1 > cameraFinalPosition.px) {
    let diff =
      (cameraSliderPosition.px - cameraFinalPosition.px) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.px -= diff;
    camera.position.x = cameraSliderPosition.px;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.pz - 0.1 > cameraFinalPosition.pz) {
    let diff =
      (cameraSliderPosition.pz - cameraFinalPosition.pz) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.pz -= diff;
    camera.position.z = cameraSliderPosition.pz;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.rx - 0.1 > cameraFinalPosition.rx) {
    let diff =
      (cameraSliderPosition.rx - cameraFinalPosition.rx) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.rx -= diff;
    camera.rotation.x = cameraSliderPosition.rx;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.ry - 0.1 > cameraFinalPosition.ry) {
    let diff =
      (cameraSliderPosition.ry - cameraFinalPosition.ry) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.ry -= diff;
    camera.rotation.y = cameraSliderPosition.ry;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.px + 0.1 < cameraFinalPosition.px) {
    let diff =
      (cameraSliderPosition.px - cameraFinalPosition.px) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.px -= diff;
    camera.position.x = cameraSliderPosition.px;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.pz + 0.1 < cameraFinalPosition.pz) {
    let diff =
      (cameraSliderPosition.pz - cameraFinalPosition.pz) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.pz -= diff;
    camera.position.z = cameraSliderPosition.pz;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.rx + 0.1 < cameraFinalPosition.rx) {
    let diff =
      (cameraSliderPosition.rx - cameraFinalPosition.rx) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.rx -= diff;
    camera.rotation.x = cameraSliderPosition.rx;
    camera.position.y = 0;
  }
  if (cameraSliderPosition.ry + 0.1 < cameraFinalPosition.ry) {
    let diff =
      (cameraSliderPosition.ry - cameraFinalPosition.ry) /
      SLIDER_ANIMATION_SPEED;
    cameraSliderPosition.ry -= diff;
    camera.rotation.y = cameraSliderPosition.rx;
    camera.position.y = 0;
  }

  controls.update();

  renderer.render(scene, camera);
}

document.onkeydown = checkKey;

addAmbiantLight(0xffffff, 0.5);
addPointLight(0xffffff, 1, 30, 30, 30);

standardKamera();

for (let i = 0; i < NUMBER_OF_SLIDES; i++) {
  addSlide(i);
}
addTorus();
drawText();
addSphere(0x447733, 0, 15, -5, 5);
addSphere(0x772211, 0, -10, 0, 8);
addBox(0x442288, 5, 10, 5, 5);
Array(5000).fill().forEach(addStar);

animate();
