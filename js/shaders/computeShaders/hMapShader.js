import ComputeShader from "./shader";

const shader = `
uniform sampler2D hMapDiff;

uniform float mapSize;
uniform float blurStrength;
uniform float blurRadius;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float currentHeight = texture2D(lastFrame, uv).x;
  float diff = texture2D(hMapDiff, uv).x;

  float s = 0.0;
  for (float i = -blurRadius; i <= blurRadius; i += 1.0) {
    for (float j = -blurRadius; j <= blurRadius; j += 1.0) {
      vec2 newPos = vec2(gl_FragCoord.x + i, gl_FragCoord.y + j);
      vec2 newUv = newPos / resolution.xy;
      s += texture2D(hMapDiff, newUv).x;
    }
  }

  float avg = s / pow(blurRadius * 2.0 + 1.0, 2.0);
  float blurredDiff = blurStrength * avg + (1.0 - blurStrength) * diff;

  gl_FragColor = vec4(currentHeight + blurredDiff, 0.0, 0.0, 1.0);
}
`;

class HeightMapShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hMapDiff"] = { value: shaders.hMapDiff.newFrame() };

    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["blurStrength"] = { value: params.blurStrength };
    uniforms["blurRadius"] = { value: params.blurRadius };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.hMapDiff.value = shaders.hMapDiff.oldFrame();
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
