const vertexShader = `
uniform sampler2D hMap;

out vec4 bump;
out vec3 pos;

const vec2 size = vec2(2.0 / 1024.0, 0.0);
const ivec3 off = ivec3(-1, 0, 1);

void main() {
  vec4 height = texture(hMap, uv);

  float s11 = height.x;
  float s01 = textureOffset(hMap, uv, off.xy).x;
  float s21 = textureOffset(hMap, uv, off.zy).x;
  float s10 = textureOffset(hMap, uv, off.yx).x;
  float s12 = textureOffset(hMap, uv, off.yz).x;
  vec3 va = normalize(vec3(size.xy, s21 - s01));
  vec3 vb = normalize(vec3(size.yx, s12 - s10));

  bump = vec4(cross(va, vb), s11);
  pos = position + normal * vec3(bump.a);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export { vertexShader };
