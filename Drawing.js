import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import Car from "./Physic";

var car = new Car();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
const textureLoader = new THREE.TextureLoader();

// floor
const grasscolorTexture = textureLoader.load("./textures/grass/color.jpg");
const grassambientocculsionTexture = textureLoader.load(
  "./textures/grass/ambientOcclusion.jpg"
);
const grassroughnessTexture = textureLoader.load(
  "./textures/grass/roughness.jpg"
);
const grassnormalTexture = textureLoader.load("./textures/grass/normal.jpg");
const DisplacementTexture = textureLoader.load(
  "./textures/grass/Displacement.jpg"
);

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.CircleGeometry(20000, 20000);
// //const material = new THREE.MeshStandardMaterial({
// color: "#ffff11"
// });

const material = new THREE.MeshStandardMaterial({
  map: grasscolorTexture,
  aoMap: grassambientocculsionTexture,
  roughnessMap: grassroughnessTexture,
  normalMap: grassnormalTexture,
  displacementMap: DisplacementTexture,
});

const Meshfloor = new THREE.Mesh(geometry, material);

Meshfloor.rotation.x = -Math.PI * 0.5;
Meshfloor.position.y = 0;
scene.add(Meshfloor);

//  grasscolorTexture.repeat.set(4, 4);
//  grassambientocculsionTexture.repeat.set(4, 4);
//  grassnormalTexture.repeat.set(4, 4);
//  grassroughnessTexture.repeat.set(4, 4);
//  DisplacementTexture.repeat.set(4, 4);

grasscolorTexture.repeat.set(18000, 18000);
grassambientocculsionTexture.repeat.set(18000, 18000);
grassnormalTexture.repeat.set(18000, 18000);
grassroughnessTexture.repeat.set(18000, 18000);
DisplacementTexture.repeat.set(18000, 18000);

grasscolorTexture.wrapS = THREE.RepeatWrapping;
grassambientocculsionTexture.wrapS = THREE.RepeatWrapping;
grassnormalTexture.wrapS = THREE.RepeatWrapping;
grassroughnessTexture.wrapS = THREE.RepeatWrapping;
DisplacementTexture.wrapS = THREE.RepeatWrapping;

grasscolorTexture.wrapT = THREE.RepeatWrapping;
grassambientocculsionTexture.wrapT = THREE.RepeatWrapping;
grassnormalTexture.wrapT = THREE.RepeatWrapping;
grassroughnessTexture.wrapT = THREE.RepeatWrapping;
DisplacementTexture.wrapT = THREE.RepeatWrapping;

// Lights

// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.75);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.5);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// end light

//////////////////////////////////////////camera and resize  ////////////////////////////////////////////
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.onload = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 15;
camera.position.y = 10;
camera.position.z = 70;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// camera

// resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.addEventListener("keydown", onDocumentKeyDown, false);
});
// end resize

////////////////////////////////////end camera and resize  ////////////////////////////////////////////

renderer.setClearColor("#87ceeb");
//renderer.setClearColor("#000000");

////////////////////////////////////  Model   ////////////////////////////////////////////////////////

//اظهار المحاور
var axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

const loader = new GLTFLoader();
const mixers = [];
const models = [];
let animationPaused = true;

function loadModel(
  modelPath,
  modelLocation,
  modelScale,
  animationIndex,
  modelRotations
) {
  loader.load(
    modelPath,
    function (gltf) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const animation = gltf.animations[animationIndex];
      if (animation) {
        const action = mixer.clipAction(animation);
        mixers.push(mixer);
        action.play();
      }

      const model = gltf.scene;
      model.scale.set(modelScale.x, modelScale.y, modelScale.z);
      model.position.set(modelLocation.x, modelLocation.y, modelLocation.z);
      model.rotation.set(modelRotations.x, modelRotations.y, modelRotations.z);
      scene.add(model);

      models.push(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

const modelPaths = ["/models/Car-Pink.glb", "/models/Racetrack/scene.gltf"];

const modelLocations = [
  { x: 0, y: 0, z: 0 },
  { x: 73.01260564013474, y: 0, z: -62.43852989999068 },
  // { x: -25, y: 3, z: -2.8 }
]; //-125.90980474839424, y: 3.589792353326659, z: 105.38946045487033}
const modelRotations = [
  { x: 0, y: Math.PI / 2, z: 0 },
  { x: 0, y: -Math.PI * 0.88, z: 0 },
  // { x: 0, y: -Math.PI / 20, z: 0 },
];

const modelScales = [
  { x: 25, y: 25, z: 25 },
  { x: 40, y: 40, z: 40 },
  // { x: 10, y: 10, z: 15 },
];

const animationIndices = [0, 1];

for (let i = 0; i < modelPaths.length; i++) {
  loadModel(
    modelPaths[i],
    modelLocations[i],
    modelScales[i],
    animationIndices[i],
    modelRotations[i]
  );
}

document.addEventListener("keydown", function (event) {
  if (event.key === "p") {
    if (animationPaused) {
      animationPaused = false;
    }
  }
});

function HalfMovement(ModelIndex, actionIndex) {
  if (!animationPaused) {
    // في حال لم تصل الابواب لنصف الحركة
    mixers[ModelIndex].update(0.05);
    const action = mixers[ModelIndex]._actions[actionIndex];
    const clipDuration = action.getClip().duration; // حساب وقت الحركة كاملا
    const currentTime = mixers[ModelIndex].time % clipDuration; // حساب الوقت الحالي
    if (currentTime >= clipDuration / 2) {
      // التأكد من وصول الحركة إلى نصف مدتها
      action.paused = true; // توقيف الحركة في الموضع الحالي
      animationPaused = true; // إيقاف حالة التشغيل
    }
  }
}


const arrowHelper=[];
function DrawVector(IndexOfVector ,vector3 ,color,lengthOfVector, startingPointOfVector) {
  
  var dir = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
  dir.normalize();
  var origin = new THREE.Vector3(
    startingPointOfVector.x,
    startingPointOfVector.y,
    startingPointOfVector.z
  );
  var length = lengthOfVector;
  var hex = color;

  // إزالة الشعاع القديم إذا كان موجودًا

  if (arrowHelper[IndexOfVector] !== undefined) {
    scene.remove(arrowHelper[IndexOfVector]);
  }
  // إضافة الشعاع الجديد وتحديث المتغير
  arrowHelper[IndexOfVector] = new THREE.ArrowHelper(dir, origin, length, hex);
  scene.add(arrowHelper[IndexOfVector]);
}



// دالة لحساب دوران الكاميرا 
  function calculateCameraRotation() {

    camera.rotation.set(-1.588217627112483 , -1.1220795298154198 , -1.590131293044983 )
      
}






var elapsedtime;
var oldElapsedTime;
var deltatime;
const clock = new THREE.Clock();


function animate() {
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 30);

  // elapsedtime
  elapsedtime = clock.getElapsedTime();
  deltatime = elapsedtime - oldElapsedTime;
  oldElapsedTime = elapsedtime;

  for (let i = 0; i < mixers.length; i++) {
    if (i == !0) mixers[i].update(deltatime);
    else HalfMovement(0, 0);
  }


  // ربط الفيزياء مع المودل
  
  // ربط الموقع 
  models[1].position.set(car.position.x, car.position.y, car.position.z);
  // ربط الدوران
  if(car.tractionForce().length()>20 )
  models[1].rotation.set(car.carDirction.RollRotationAngle, car.carDirction.YawRotationAngle + Math.PI/2, car.carDirction.PitchRotationAngle);

  car.update(deltatime);

console.log("rotation camera",camera.rotation)
console.log("position camera",camera.position)

  // رسم الاشعة 

  
  DrawVector(1,car.wheelDirctionFront.right() , 0x00ffff, 5,  new THREE.Vector3(car.cgToFrontAxle + car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(2,car.wheelDirctionFront.up()    , 0xff0000, 5,  new THREE.Vector3(car.cgToFrontAxle + car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(0,car.wheelDirctionFront.front() , 0x0000ff, 5,  new THREE.Vector3(car.cgToFrontAxle + car.position.x , car.position.y+0.2, car.position.z))

  DrawVector(4,car.wheelDirctionRear.right() , 0x00ffff, 5,  new THREE.Vector3(-car.cgToRearAxle + car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(5,car.wheelDirctionRear.up()    , 0xff0000, 5,  new THREE.Vector3(-car.cgToRearAxle + car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(6,car.wheelDirctionRear.front() , 0x0000ff, 5,  new THREE.Vector3(-car.cgToRearAxle + car.position.x , car.position.y+0.2, car.position.z))
  
  
  DrawVector(8,car.carDirction.right() , 0x00ffff, 5,  new THREE.Vector3(car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(9,car.carDirction.up()    , 0xff0000, 5,  new THREE.Vector3(car.position.x , car.position.y+0.2, car.position.z))
  DrawVector(10,car.carDirction.front() , 0x0000ff, 5,  new THREE.Vector3(car.position.x , car.position.y+0.2, car.position.z))

  controls.update();

  
  gsap.to(camera.position, {
   x: -7.951296146144171 + car.position.x, y: 3.827756783971448+car.position.y, z: -0.06669124757871361 + car.position.z ,
    duration: 1  
  });
 calculateCameraRotation();







  renderer.render(scene, camera);
}

animate();
