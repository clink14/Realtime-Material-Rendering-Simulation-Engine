export function setupUI(events) {
  const materialSelect = document.getElementById("materialSelect");
  const transparencySlider = document.getElementById("transparencySlider");
  const tint = document.getElementById("tint");
  const tintStrengthSlider = document.getElementById("tintStrengthSlider");
  const tintStrengthLabel = document.getElementById("tintStrengthLabel");
  const roughnessSlider = document.getElementById("roughnessSlider");
  const metalnessSlider = document.getElementById("metalnessSlider");
  const resetMaterialBtn = document.getElementById("resetMaterialBtn");
  const fluidBtn = document.getElementById("fluidBtn");
  const slimeBtn = document.getElementById("slimeBtn");
  const cameraBtn = document.getElementById("cameraBtn");

  // Material Select
  materialSelect.onchange = () => {
    const type = materialSelect.value;
    events.changeMaterial(type);

    tint.value = "default"
    events.changeTint("default");
    tintStrengthSlider.value = 0.0;
    events.updateTintStrength(0.0);
    tintStrengthSlider.style.display = "none";
    tintStrengthLabel.style.display = "none"; 

    const roughLabel = roughnessSlider.previousElementSibling;
    const metalLabel = metalnessSlider.previousElementSibling;

    if (type === "glass") {
      if (tint.value !== "default") {
        tintStrengthSlider.style.display = "block";
        tintStrengthLabel.style.display = "block";

        tintStrengthSlider.value = 0.5;
        events.updateTintStrength(0.5);
      } else {
        tintStrengthSlider.style.display = "none";
        tintStrengthLabel.style.display = "none";

        tintStrengthSlider.value = 0.0;
        events.updateTintStrength(0.0);
      }

      roughnessSlider.style.display = "none";
      metalnessSlider.style.display = "none";
      if (roughLabel) roughLabel.style.display = "none";
      if (metalLabel) metalLabel.style.display = "none";

      transparencySlider.min = -1.0;
      transparencySlider.max = 1.0;

      transparencySlider.value = 0.0;
      events.updateTransparency(0.0);

    } else {
      tintStrengthSlider.style.display = "none";
      tintStrengthLabel.style.display = "none";

      roughnessSlider.style.display = "block";
      metalnessSlider.style.display = "block";
      if (roughLabel) roughLabel.style.display = "block";
      if (metalLabel) metalLabel.style.display = "block";

      transparencySlider.min = 0.0;
      transparencySlider.max = 1.0;

      transparencySlider.value = 0.0;
      events.updateTransparency(0.0);
    }
  };

  // Transparency
  transparencySlider.oninput = () => {
    events.updateTransparency(transparencySlider.value);
  };

  // Tint Select
  tint.onchange = () => {
    events.changeTint(tint.value);

    if (materialSelect.value === "glass" && tint.value !== "default") {
      tintStrengthSlider.style.display = "block";
      tintStrengthLabel.style.display = "block";
    } else {
      tintStrengthSlider.style.display = "none";
      tintStrengthLabel.style.display = "none";
    }

    if (tint.value === "default") {
      tintStrengthSlider.value = 0.0;
      events.updateTintStrength(0.0);
    } else {
      tintStrengthSlider.value = 0.5;
      events.updateTintStrength(0.5);
    }
  };

  // Tint Strength
  tintStrengthSlider.oninput = () => {
    events.updateTintStrength(parseFloat(tintStrengthSlider.value));
  };

  // Roughness
  roughnessSlider.oninput = () => {
    events.updateRough(roughnessSlider.value);
  };

  // Metalness
  metalnessSlider.oninput = () => {
    events.updateMetal(metalnessSlider.value);
  };

  // Fluid Mode
  fluidBtn.onclick = () => {
    events.toggleFluid();

    if (events.fluid) {
      fluidBtn.classList.remove("active");
      fluidBtn.textContent = "Fluid Mode ON";
    } else {
      fluidBtn.classList.add("active");
      fluidBtn.textContent = "Fluid Mode OFF";
    }
  };

  // Slime Mode
  slimeBtn.onclick = () => {
    events.toggleSlime();

    if (events.slime) {
      slimeBtn.classList.remove("active");
      slimeBtn.textContent = "Slime Mode ON";
    } else {
      slimeBtn.classList.add("active");
      slimeBtn.textContent = "Slime Mode OFF";
    }
  };

  // Camera Mode
  cameraBtn.onclick = () => {
    events.toggleCameraRotation();

    if (events.cameraRotation) {
      cameraBtn.classList.add("active");
      cameraBtn.textContent = "Camera Rotation OFF";
    } else {
      cameraBtn.classList.remove("active");
      cameraBtn.textContent = "Camera Rotation ON";
    }
  };

  // Reset Material Button
  resetMaterialBtn.onclick = () => {
    const type = materialSelect.value;

    if (type === "glass") {
      // UI default for glass
      transparencySlider.value = 0.0;
      events.updateTransparency(0.0);

      if (tint.value === "default") {
        tintStrengthSlider.value = 0.0;
        events.updateTintStrength(0.0);
      } else {
        tintStrengthSlider.value = 0.5;
        events.updateTintStrength(0.5);
      }

    } else {
      // UI default for chrome
      roughnessSlider.value = 0.3;
      metalnessSlider.value = 0.8;
      transparencySlider.value = 0.0;

      events.updateRough(0.3);
      events.updateMetal(0.8);
      events.updateTransparency(0.0);
    }
  };

  // Initialize
  materialSelect.onchange()
  tint.onchange

  if (events.fluid) {
    fluidBtn.classList.remove("active");
    fluidBtn.textContent = "Fluid Mode ON";
  } else {
    fluidBtn.classList.add("active");
    fluidBtn.textContent = "Fluid Mode OFF";
  }

  if (events.slime) {
    slimeBtn.classList.remove("active");
    slimeBtn.textContent = "Slime Mode ON";
  } else {
    slimeBtn.classList.add("active");
    slimeBtn.textContent = "Slime Mode OFF";
  }

  if (events.cameraRotation) {
    cameraBtn.classList.add("active");
    cameraBtn.textContent = "Camera Rotation OFF";
  } else {
    cameraBtn.classList.remove("active");
    cameraBtn.textContent = "Camera Rotation ON";
  }
}
