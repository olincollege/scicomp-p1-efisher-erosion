import * as THREE from "three";

import ComputeShader from "./shader";

const shader = `
uniform sampler2D hmap;
uniform sampler2D pos;
uniform float mapSize;
uniform float inertia;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec2 pos = texture2D(pos, uv).xy;
  vec2 bottomLeft = floor(pos);
  vec2 bottomRight = vec2(ceil(pos.x), floor(pos.y));
  vec2 topLeft = vec2(floor(pos.x), ceil(pos.y));
  vec2 topRight = ceil(pos);

  float bottomLeftHeight = texture2D(hmap, bottomLeft / mapSize);
  float bottomRightHeight = texture2D(hmap, bottomRight / mapSize);
  float topLeftHeight = texture2D(hmap, topLeft / mapSize);
  float topRightHeight = texture2D(hmap, topRight / mapSize);

  vec2 delta = pos - bottomLeft;
  vec2 gradient = vec2(
    // x Gradient
    (bottomRightHeight - bottomLeftHeight) * (1 - delta.y) +
    (topRightHeight - topLeftHeight) * delta.y,
    // y Gradient
    (topLeftHeight - bottomLeftHeight) * (1 - delta.x) +
    (topRightHeight - bottomRightHeight) * delta.x,
  );

  vec2 oldDir = texture2D(lastFrame, uv).xy;
  vec2 newDir = oldDir * inertia - gradient * (1 - inertia);

  gl_FragColor = vec4(newDir, 0.0, 1.0);
}
`;

class DirectionShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hMap"] = { value: params.hMap.newFrame() };
    uniforms["pos"] = { value: shaders.pos.newFrame() };
    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["inertia"] = { value: params.inertia };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.hMap.value = shaders.hMap.newFrame();
    uniforms.pos.value = shaders.pos.newFrame();
    uniforms.mapSize.value = params.mapSize;
    uniforms.inertia.value = params.inertia;

    this.params.meshes.plane.material.uniforms.hMap.value = this.newFrame();
    this.params.meshes.plane.material.uniforms.hMap.needsUpdate = true;
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    const vec = new THREE.Vector2(0, 0);
    for (let k = 0; k < arr.length; k += 4) {
      vec.x = Math.random() * 2 - 1;
      vec.y = Math.random() * 2 - 1;
      vec.normalize();
      arr[k + 0] = vec.x;
      arr[k + 1] = vec.y;
      arr[k + 2] = 0.0;
      arr[k + 3] = 0.0;
    }
  }
}

export { DirectionShader };
