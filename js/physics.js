export function setupPhysics(geo) {
  const posAttr = geo.attributes.position;
  const basePositions = posAttr.array.slice();
  const velocities = new Float32Array(posAttr.array.length);

  function relax(dt) {
    const k = 6.0;
    const d = 3.3;
    const cur = posAttr.array;

    for (let i = 0; i < cur.length; i++) {
      const x = cur[i], xo = basePositions[i];
      let v = velocities[i];
      const f = (xo - x) * k - v * d;
      v += f * dt;
      cur[i] += v * dt;
      velocities[i] = v;
    }

    posAttr.needsUpdate = true;
    geo.computeVertexNormals();
  }

  function pull(index, normal) {
    const i3 = index * 3;

    const centerStrength = 0.05;
    velocities[i3]     += normal.x * centerStrength;
    velocities[i3 + 1] += normal.y * centerStrength;
    velocities[i3 + 2] += normal.z * centerStrength;

    const pos = posAttr.array;
    const hx = pos[i3], hy = pos[i3+1], hz = pos[i3+2];

    for (let j = 0; j < pos.length; j += 3) {
      if (j === i3) continue;

      const dx = pos[j] - hx;
      const dy = pos[j+1] - hy;
      const dz = pos[j+2] - hz;

      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const w = Math.exp(-(dist*5.5)*(dist*5.5));
      if (w < 0.0005) continue;

      const nx = normal.x * 0.8, ny = normal.y * 0.8, nz = normal.z * 0.8;
      const tx = dx * 0.2, ty = dy * 0.2, tz = dz * 0.2;

      const fx = (nx + tx) * 0.08 * w;
      const fy = (ny + ty) * 0.08 * w;
      const fz = (nz + tz) * 0.08 * w;

      velocities[j]     += fx;
      velocities[j + 1] += fy;
      velocities[j + 2] += fz;
    }
  }

  return { relax, pull };
}
