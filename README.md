# Realtime-Material-Rendering-Simulation-Engine
Interactive real-time material rendering engine built with WebGL and custom shaders.  
It focuses on expressive glass/chrome materials and soft-body physics for cinematic visual experiments.


## Features

### 1. Custom Physically-Based Glass Shader
- RGB-split refraction (chromatic dispersion)
- Absorption based on thickness  
- Thin-film style edge rainbow shimmer
- Dynamic surface distortion (fluid behavior)
- Tint color & tint intensity control  
- Environment-map based refraction & reflection blending  
- Fresnel term (Schlick approx)

### 2. Chrome / Metallic Shader
- Metalness interpolation  
- Roughness-based blurring  
- Reflective environment mapping  
- Custom micro-distortion for fluid mode  

### 3. Soft-body Physics Engine
CPU-side lightweight simulation:
- Vertex-level Verlet-like relaxation  
- Spring-like force restoring original shape  
- Distance-based falloff for pulling  
- Real-time user interaction via raycasting  
- “Slime Mode”: dragging vertices with smooth propagation  
- “Fluid Mode”: shader-level wobble animations  

### 4. UI System
Interactive controls:
- Material (Glass / Chrome)
- Tint color presets
- Tint strength (Glass only)
- Transparency
- Roughness & Metalness (Chrome only)
- Fluid Mode toggle
- Slime Mode toggle
- Camera Rotation toggle
- Reset to defaults

## Project Structure
```
.
├── index.html
├── style.css
└── js/
    ├── main.js        # Scene, camera, renderer, physics loop
    ├── ui.js          # UI binding and event handlers
    ├── materials.js   # Material factory + uniform setup
    ├── shaders.js     # Vertex/fragment GLSL shaders
    └── physics.js     # Soft-body deformation system
```

## How to Run
- Live Demo: https://clink14.github.io/Realtime-Material-Rendering-Simulation-Engine/
- Local: Clone the repository and run it on any local web server.

## Author
Seohyun Ahn  
Undergraduate, Computer Science @ KAIST

_Project created in 2025._
