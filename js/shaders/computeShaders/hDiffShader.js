import ComputeShader from "./shader";

const shader = `
uniform sampler2D hMap;
uniform sampler2D oldPos;
uniform sampler2D newPos;
uniform float mapSize;

float getHeight(vec2 p) {
  // Perform bilinear interpolation to get height
  vec2 bottomLeft = floor(p);
  vec2 bottomRight = vec2(ceil(p.x), floor(p.y));
  vec2 topLeft = vec2(floor(p.x), ceil(p.y));
  vec2 topRight = ceil(p);

  float bottomLeftHeight = texture2D(hMap, bottomLeft / mapSize).x;
  float bottomRightHeight = texture2D(hMap, bottomRight / mapSize).x;
  float topLeftHeight = texture2D(hMap, topLeft / mapSize).x;
  float topRightHeight = texture2D(hMap, topRight / mapSize).x;

  vec2 delta = p - bottomLeft;

  // Bilinear interpolation
  return (
    (
      bottomLeftHeight * (1.0 - delta.x) +
      bottomRightHeight * delta.x
    ) * (1.0 - delta.y)  +
    (
      topLeftHeight * (1.0 - delta.x) +
      topRightHeight * delta.x
    ) * delta.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float oldHeight = getHeight(texture2D(oldPos, uv).xy);
  float newHeight = getHeight(texture2D(newPos, uv).xy);
  // vec2 oldPos = texture2D(oldPos, uv).xy;
  // float oldHeight = texture2D(hMap, oldPos / mapSize).x;
  // vec2 newPos = texture2D(newPos, uv).xy;
  // float newHeight = texture2D(hMap, newPos / mapSize).x;
  float diff = newHeight - oldHeight;

  gl_FragColor = vec4(diff / 1.0, 0.0, 0.0, 0.0);
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
