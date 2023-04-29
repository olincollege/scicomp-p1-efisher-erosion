import ComputeShader from "./shader";

const shader = `
uniform sampler2D hMapDiff;

uniform float mapSize;
uniform float blur;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float currentHeight = texture2D(lastFrame, uv).x;
  float diff = texture2D(hMapDiff, uv).x;

  float s = 0.0;
  for (float i = -2.0; i <= 2.0; i += 1.0) {
    for (float j = -2.0; j <= 2.0; j += 1.0) {
      vec2 newPos = vec2(gl_FragCoord.x + i, gl_FragCoord.y + j);
      vec2 newUv = newPos / resolution.xy;
      s += texture2D(hMapDiff, newUv).x;
    }
  }

  float avg = s / 9.0;
  float blurredDiff = blur * avg + (1.0 - blur) * diff;

  gl_FragColor = vec4(currentHeight + blurredDiff, 0.0, 0.0, 1.0);
}
`;

class HeightMapShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hMapDiff"] = { value: shaders.hMapDiff.newFrame() };

    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["blur"] = { value: params.blur };
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
