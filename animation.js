import * as THREE from './vendor/three/three.module.min.js';

const canvas = document.querySelector('.scene');

try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 5;

  const shape = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.23, 96, 12),
    new THREE.MeshStandardMaterial({ color: '#b4442b', roughness: 0.45, metalness: 0.15 }),
  );
  scene.add(shape);
  scene.add(new THREE.HemisphereLight('#fff6df', '#263d32', 3));
  const light = new THREE.DirectionalLight('#ffffff', 3);
  light.position.set(3, 4, 5);
  scene.add(light);

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  renderer.setAnimationLoop((time) => {
    const seconds = time / 1000;
    shape.rotation.set(seconds * 0.25, seconds * 0.4, 0.2);
    shape.position.y = Math.sin(seconds * 0.8) * 0.1;
    renderer.render(scene, camera);
  });
} catch (error) {
  // The greeting remains usable on browsers without WebGL support.
  canvas.hidden = true;
  console.warn('The decorative Three.js scene could not start.', error);
}
