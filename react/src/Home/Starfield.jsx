// src/components/Starfield.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

const Starfield = () => {
  const containerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) {
      console.error("❌ Starfield container not found!");
      return;
    }

    console.log("✅ Starfield Mounted");

    // Create Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create fewer stars for better visibility
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2500; // Reduced for clarity
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      color: new THREE.Color(theme.text),
      transparent: true,
      opacity: 0.70, // Adjusted for better blending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 500;

    // Slow star movement effect
    const animate = () => {
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [theme]);

  return <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none" />;
};

export default Starfield;
