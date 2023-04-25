const vertexShader = `
uniform sampler2D hMap;

out float d;

void main() {
  float displacement = texture2D(hMap, uv).x;
  d = displacement;

  vec3 newPosition = position + normal * vec3(displacement);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export { vertexShader };
