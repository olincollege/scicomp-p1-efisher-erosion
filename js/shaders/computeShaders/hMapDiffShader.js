import ComputeShader from "./shader";

const shader = `
uniform sampler2D pos;
uniform sampler2D oldSed;
uniform sampler2D newSed;

uniform float mapSize;
uniform float droplets;
uniform float radius;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float totalChange = 0.0;

  for (float i = 0.0; i < droplets; i += 1.0) {
    float particle = i / droplets;

    vec2 particlePos = texture2D(pos, vec2(particle, 0.0)).xy;
    vec2 pointPos = gl_FragCoord.xy;
    float dist = distance(particlePos, pointPos);

    if (dist >= radius) {
      continue;
    }

    float particleOldSed = texture2D(oldSed, vec2(particle, 0.0)).x;
    float particleNewSed = texture2D(newSed, vec2(particle, 0.0)).x;
    float deltaSed = particleNewSed - particleOldSed;
    float portion = ((radius - dist) / radius) / (pow(radius, 2.0));

    totalChange -= deltaSed * portion;
  }

  gl_FragColor = vec4(totalChange, 0.0, 0.0, 1.0);
}
`;

class HeightMapDifferenceShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["pos"] = { value: params.emptyTexture };
    uniforms["oldSed"] = { value: params.emptyTexture };
    uniforms["newSed"] = { value: params.emptyTexture };

    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["droplets"] = { value: params.droplets };
    uniforms["radius"] = { value: params.radius };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.pos.value = shaders.pos.oldFrame();
    uniforms.oldSed.value = shaders.sed.oldFrame();
    uniforms.newSed.value = shaders.sed.newFrame();
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 1) {
      arr[k] = 0;
    }
  }
}

export { HeightMapDifferenceShader };
