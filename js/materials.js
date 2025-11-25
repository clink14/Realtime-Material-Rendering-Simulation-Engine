import { shaders } from "./shaders.js";

export function createMaterial(type, envTex) {
  let s = shaders[type];

  let baseUniforms = {
    envMap: { value: envTex || null },
    cameraPos: { value: new THREE.Vector3() },
    time: { value: 0 },
  };

  if (type === "glass") {
    baseUniforms.ior = { value: 1.34 };
    baseUniforms.tint = { value: new THREE.Color(0xf6fbff) };
    baseUniforms.lightDir = { value: new THREE.Vector3(0.5,1.0,0.3).normalize() };
    baseUniforms.transparency = { value: 0.0 }; 
    baseUniforms.fluidStrength = { value: 1.0 };
    baseUniforms.tintStrength = { value: 0.0 };
  }

  if (type === "chrome") {
    baseUniforms.tint = { value: new THREE.Color("white") };
    baseUniforms.metal = { value: 0.8 };
    baseUniforms.rough = { value: 0.3 };
    baseUniforms.transparency = { value: 0.0 };
    baseUniforms.fluidStrength = { value: 1.0 };
  }

  return new THREE.ShaderMaterial({
    uniforms: baseUniforms,
    vertexShader: s.vertex,
    fragmentShader: s.fragment,
    transparent: true,
  });
}
