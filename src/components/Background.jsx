import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, dodecahedron, particles;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.position.z = 5;

      const dodecahedronGeometry = new THREE.DodecahedronGeometry(1.5, 0);
      const dodecahedronMaterial = new THREE.MeshPhongMaterial({
        color: 0x1c1c3a,
        emissive: 0x0a0a2a,
        shininess: 100,
        flatShading: true,
      });
      dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
      scene.add(dodecahedron);

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
      }
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x1f2937,
        size: 0.05,
      });
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      const ambientLight = new THREE.AmbientLight(0x202020);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 1);
      scene.add(directionalLight);

      const onWindowResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onWindowResize);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      dodecahedron.rotation.x += 0.005;
      dodecahedron.rotation.y += 0.005;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", () => {});
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000"
    ></canvas>
  );
}
