// Mainly used for debugging
const w = window;
w.THREE = THREE;

let renderer, scene, camera, orbitControls;

function setupThreejs() {
  // Make a renderer that fills the screen
  renderer = new THREE.WebGLRenderer({ antialias: true });
  w.renderer = renderer;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.xr.enabled = true;

  scene = new THREE.Scene();

  scene.add(new THREE.GridHelper(20, 20));
  scene.add(new THREE.AxesHelper(11));

  setupOrbitCam();

  document.getElementById("container3D").appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  onWindowResize();
}

function setupOrbitCam() {
  camera = new THREE.PerspectiveCamera(50, undefined, 0.01, 100);
  camera.position.set(-3, 2, 3);
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.target.y = 1.5;
  orbitControls.update();
  scene.add(camera);
}

function onWindowResize() {
  let aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // Draw everything
  renderer.render(scene, camera);
}

async function start() {
  setupThreejs();

  // Add a button to enter/exit vr to the page
  document.body.appendChild(VRButton.createButton(renderer));

  animate();
}

start();
