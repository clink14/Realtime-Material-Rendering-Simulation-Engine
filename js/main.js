import { createMaterial } from "./materials.js";
import { setupPhysics } from "./physics.js";
import { setupUI } from "./ui.js";

let scene, camera, renderer, controls;
let envTex;
let blob, geo;

let fluid = true;
let slime = true;
let cameraRotation = false;
let targetFluid = 1.0;
let tintStrength = 0.0;

let materialType = "glass";
let currentMaterial;

// Scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0.4, 0.9, 2.3);

renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;
controls.target.set(0,0.3,0);

// Environment
new THREE.TextureLoader().load(
  "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
  tex => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    envTex = tex;
    scene.background = tex;
    applyMaterial();
  }
);

scene.add(new THREE.DirectionalLight(0xffffff,1.3).position.set(1.5,2,1.5));

// Geometry & physics
geo = new THREE.SphereGeometry(0.55,128,128);
const physics = setupPhysics(geo);

// Blob
blob = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: "white" }));
blob.position.y = 0.3;
scene.add(blob);

// Material
function applyMaterial() {
  currentMaterial = createMaterial(materialType, envTex);
  blob.material = currentMaterial;
}

// UI
setupUI({
  get fluid(){ return fluid; },
  get slime(){ return slime; },
  get cameraRotation(){ return cameraRotation; },

  toggleFluid(){
    fluid = !fluid;
    targetFluid = fluid ? 1.0 : 0.0;
  },

  toggleSlime(){
    slime = !slime;
  },

  toggleCameraRotation(){
    cameraRotation = !cameraRotation;
    controls.autoRotate = !cameraRotation;
  },

  changeMaterial(type){
    materialType = type;
    applyMaterial();
  },
  
  updateTransparency(v) {
    if (currentMaterial.uniforms.transparency)
      currentMaterial.uniforms.transparency.value = parseFloat(v);
  },

  changeTint(tint){
    const presets = {
      default: 0xffffff,
      pink: 0xff2b8a,
      yellow: 0xffe875,
      cyan: 0x55ffee,
      blue: 0x0047ff,
      violet: 0xD24CFF
    };
    if (currentMaterial.uniforms.tint) {
      currentMaterial.uniforms.tint.value.setHex(presets[tint]);
    }
  },

  updateTintStrength(v) {
    tintStrength = v;
    if (currentMaterial.uniforms.tintStrength)
      currentMaterial.uniforms.tintStrength.value = v;
  },

  updateRough(v){
    if(currentMaterial.uniforms.rough)
      currentMaterial.uniforms.rough.value = parseFloat(v);
  },

  updateMetal(v){
    if(currentMaterial.uniforms.metal)
      currentMaterial.uniforms.metal.value = parseFloat(v);
  }
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let dragging = false;

function updateMouse(e){
  const r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX-r.left)/r.width)*2 - 1;
  mouse.y = -((e.clientY-r.top)/r.height)*2 + 1;
}

renderer.domElement.addEventListener("pointerdown", e=>{
  dragging = true;
  updateMouse(e);
});
renderer.domElement.addEventListener("pointerup", ()=>dragging=false);
renderer.domElement.addEventListener("pointerleave", ()=>dragging=false);

renderer.domElement.addEventListener("pointermove", e=>{
  updateMouse(e);

  if(!dragging || !slime) return;

  raycaster.setFromCamera(mouse,camera);
  const hit = raycaster.intersectObject(blob);
  if(hit.length === 0) return;

  let f = hit[0].face;
  if(!f) return;

  physics.pull(f.a, f.normal);
  physics.pull(f.b, f.normal);
  physics.pull(f.c, f.normal);
});

// Animation
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  const t = clock.elapsedTime;

  if(currentMaterial && currentMaterial.uniforms.time)
    currentMaterial.uniforms.time.value = t;

  if(currentMaterial && currentMaterial.uniforms.cameraPos)
    currentMaterial.uniforms.cameraPos.value.copy(camera.position);

  if (currentMaterial && currentMaterial.uniforms.fluidStrength) {
    const f = currentMaterial.uniforms.fluidStrength.value;
    const speed = 2.0; // 전환 속도 (높을수록 빠름)
    currentMaterial.uniforms.fluidStrength.value += (targetFluid - f) * dt * speed;
  }

  if(!cameraRotation)
    blob.position.y = 0.3 + Math.sin(t*1.3)*0.03;

  if(slime)
    physics.relax(dt);

  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
