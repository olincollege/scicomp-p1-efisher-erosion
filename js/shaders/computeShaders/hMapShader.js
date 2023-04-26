import ComputeShader from "./shader";

const shader = `
uniform sampler2D pos;
uniform sampler2D oldSed;
uniform sampler2D newSed;

uniform float mapSize;
uniform float droplets;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float currentHeight = texture2D(lastFrame, uv).x;

  for (float i = 0.5; i < droplets + 1.0; i += 1.0) {
    float particle = i / droplets;

    vec2 particlePos = texture2D(pos, vec2(particle, 0.5)).xy;
    vec2 pointPos = gl_FragCoord.xy;
    float dist = distance(particlePos, pointPos);

    if (dist >= 1.0) {
      continue;
    }

    float particleOldSed = texture2D(oldSed, vec2(particle, 0.5)).x;
    float particleNewSed = texture2D(newSed, vec2(particle, 0.5)).x;
    float deltaSed = particleNewSed - particleOldSed;

    float deltaX = abs(particlePos.x - pointPos.x);
    float deltaY = abs(particlePos.y - pointPos.y);
    float portion  = ((1.0 - deltaX) + (1.0 - deltaY)) / 4.0;
    float deposition = deltaSed * portion;

    currentHeight -= deposition;
  }

  gl_FragColor = vec4(currentHeight, 0.0, 0.0, 1.0);
}
`;

class HeightMapShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["pos"] = { value: params.emptyTexture };
    uniforms["oldSed"] = { value: params.emptyTexture };
    uniforms["newSed"] = { value: params.emptyTexture };

    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["droplets"] = { value: params.droplets };
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
    const map = params.heightMap.image.data;
    for (let k = 0; k < arr.length; k += 1) {
      arr[k] = map[k];
    }
  }
}

export { HeightMapShader };
