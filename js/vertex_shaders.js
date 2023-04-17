const vertexShader = `
attribute float displacement;

out float d;

void main() {
  vec3 newPosition = position + normal * vec3(displacement);
  d = displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export { vertexShader };
