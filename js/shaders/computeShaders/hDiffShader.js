import ComputeShader from "./shader";

const shader = `
uniform sampler2D hMap;
uniform sampler2D oldPos;
uniform sampler2D newPos;
uniform float mapSize;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec2 oldP = texture2D(oldPos, uv).xy;
  float oldHeight = texture2D(hMap, oldP / mapSize).x;
  vec2 newP = texture2D(newPos, uv).xy;
  float newHeight = texture2D(hMap, newP / mapSize).x;

  gl_FragColor = vec4(newHeight - oldHeight, 0.0, 0.0, 0.0);
}
`;

class HeightDifferenceShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hMap"] = { value: params.heightMap };
    uniforms["oldPos"] = { value: params.emptyTexture };
    uniforms["newPos"] = { value: params.emptyTexture };
    uniforms["mapSize"] = { value: params.mapSize };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.hMap.value = shaders.hMap.newFrame();
    uniforms.oldPos.value = shaders.pos.oldFrame();
    uniforms.newPos.value = shaders.pos.newFrame();
    uniforms.mapSize.value = params.mapSize;
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = 0.0;
      arr[k + 1] = 0.0;
      arr[k + 2] = 0.0;
      arr[k + 3] = 0.0;
    }
  }
}

export { HeightDifferenceShader };
