import ComputeShader from "./shader";

const shader = `
uniform sampler2D hDiff;
uniform sampler2D vel;
uniform sampler2D water;

uniform float minSlope;
uniform float capacity;
uniform float deposition;
uniform float erosion;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float hDiff = sampler2D(hDiff, uv).x;
  float water = sampler2D(water, uv).x;
  float vel = sampler2D(vel, uv).x;

  float newCapacity = max(-hDiff, minSlope) * vel * water * capacity;

  float oldSediment = sampler2D(lastFrame, uv).x;
  float delta;
  if (oldSediment >= newCapacity) {
    delta = (oldSediment - newCapacity) * deposition;
  } else {
    delta = min((newCapacity - oldSediment) * erosion, -hDiff);
  }
  float newSediment = oldSediment + delta;

  gl_FragColor = vec4(newSediment, 0.0, 0.0, 1.0);
}
`;

class SedimentShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hDiff"] = { value: params.emptyTexture };
    uniforms["vel"] = { value: params.emptyTexture };
    uniforms["water"] = { value: params.emptyTexture };

    uniforms["minSlope"] = { value: params.minSlope };
    uniforms["capacity"] = { value: params.capacity };
    uniforms["deposition"] = { value: params.deposition };
    uniforms["erosion"] = { value: params.erosion };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.hDiff.value = shaders.hDiff.newFrame();
    uniforms.vel.value = shaders.vel.newFrame();
    uniforms.water.value = shaders.water.newFrame();

    uniforms.minSlope.value = params.minSlope;
    uniforms.capacity.value = params.capacity;
    uniforms.deposition.value = params.deposition;
    uniforms.erosion.value = params.erosion;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = 0.0;
      arr[k + 1] = 0.0;
      arr[k + 2] = 0.0;
      arr[k + 3] = 1.0;
    }
  }
}

export { SedimentShader };
