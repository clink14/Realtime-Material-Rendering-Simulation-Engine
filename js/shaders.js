export const shaders = {

  glass: {
    vertex: `
      uniform float time;
      uniform float fluidStrength;
      varying vec3 vWorldPos;
      varying vec3 vNormal;

      void main() {
        vec3 p = position;

        float f = fluidStrength;
        p += normal * (0.04 * f) * sin(p.y*5.0 + time*1.6 + p.x*3.0);
        p += normal * (0.03 * f) * sin(p.x*7.0 - time*1.3 + p.z*2.5);

        vec4 worldPos = modelMatrix * vec4(p,1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragment: `
      precision highp float;

      uniform sampler2D envMap;
      uniform vec3 cameraPos;
      uniform float time;
      uniform float ior;
      uniform vec3 tint;
      uniform vec3 lightDir;
      uniform float transparency;
      uniform float tintStrength; 

      varying vec3 vWorldPos;
      varying vec3 vNormal;

      vec2 dirToUV(vec3 d){
        d = normalize(d);
        float u = atan(d.z, d.x) / (2.0 * 3.14159265) + 0.5;
        float v = d.y * 0.5 + 0.5;
        return vec2(u, v);
      }

      void main(){
        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPos - vWorldPos);

        N = normalize(N + 0.025 * vec3(
          sin(vWorldPos.y * 6.0 + time * 1.1),
          sin(vWorldPos.z * 5.0 - time * 1.3),
          sin(vWorldPos.x * 7.0 + time * 1.5)
        ));

        float iorR = ior;
        float iorG = ior + 0.015;
        float iorB = ior + 0.03;

        vec3 refrR = refract(-V, N, 1.0 / iorR);
        vec3 refrG = refract(-V, N, 1.0 / iorG);
        vec3 refrB = refract(-V, N, 1.0 / iorB);

        vec3 refrCol = vec3(
          texture2D(envMap, dirToUV(refrR)).r,
          texture2D(envMap, dirToUV(refrG)).g,
          texture2D(envMap, dirToUV(refrB)).b
        );

        float facing = clamp(1.0 - max(dot(N, V), 0.0), 0.0, 1.0);
        float thickness = 0.6 + 1.2 * facing;
        vec3 absorption = exp(-vec3(0.005, 0.01, 0.02) * thickness);
        refrCol *= absorption;

        refrCol = mix(vec3(1.05), refrCol, 0.85);

        float edge = pow(facing, 3.5);

        vec3 thinRainbow = vec3(
          0.9 + 0.3*sin(time*3.0 + edge*12.0),
          0.95+ 0.35*sin(time*3.3 + edge*15.0 + 1.8),
          1.0
        );

        refrCol += thinRainbow * edge * 0.18;

        vec3 L = normalize(lightDir);
        vec3 H = normalize(L + V);

        float spec = pow(max(dot(N, H), 0.0), 420.0);
        refrCol += vec3(1.0) * spec * 0.25;

        float F0 = 0.03;
        float fres = F0 + (1.0 - F0)*pow(1.0-max(dot(N,V),0.0),5.0);

        vec3 refl = texture2D(envMap, dirToUV(reflect(-V, N))).rgb;
        refrCol = mix(refrCol, refl, fres * 0.12);

        float baseTint = 0.7;
        float tintMix;
        if (tintStrength != 0.0) {
          tintMix = baseTint * tintStrength;
        } else {
          tintMix = 0.0;
        }
        refrCol = mix(refrCol, tint, tintMix);
        refrCol = pow(refrCol, vec3(0.4545));

        float baseAlpha = 0.55 + 0.25 * pow(facing, 1.2);
        float alpha = mix(baseAlpha, 0.25, transparency * 0.85);
        gl_FragColor = vec4(refrCol, alpha);

      }
    `
  },

  chrome: {
    vertex: `
      uniform float time;
      uniform float fluidStrength;
      varying vec3 vWorldPos;
      varying vec3 vNormal;

      void main() {
        vec3 p = position;

        float f = fluidStrength;
        p += normal * (0.020 * f) * sin(p.y*5.0 + time*1.6 + p.x*3.0);
        p += normal * (0.015 * f) * sin(p.x*7.0 - time*1.3 + p.z*2.5);

        vec4 worldPos = modelMatrix * vec4(p,1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragment: `
      precision highp float;

      uniform sampler2D envMap;
      uniform vec3 cameraPos;
      uniform vec3 tint;
      uniform float metal;
      uniform float rough;
      uniform float transparency;

      varying vec3 vNormal;
      varying vec3 vWorldPos;

      vec2 dirToUV(vec3 d){
        d = normalize(d);
        float u = atan(d.z,d.x)/(2.0*3.14159265)+0.5;
        float v = d.y*0.5+0.5;
        return vec2(u,v);
      }

      void main(){
        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPos - vWorldPos);

        vec3 R = reflect(-V, N);
        vec3 col = texture2D(envMap, dirToUV(R)).rgb;

        col = mix(col, tint, 0.2 * metal);
        col = mix(col, col * col, rough);

        gl_FragColor = vec4(col, 1.0 - 0.5 * transparency);
      }
    `
  }
};
