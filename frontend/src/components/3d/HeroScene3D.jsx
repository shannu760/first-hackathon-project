import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Interactive Hero Canvas
 * Inspired by Pinterest Pin 1 (Dynamic Seekable 3D Hero) and Pin 2 (Sculpted Statue / Celestial Centerpiece)
 * Using Pin 3 Color Palette: Wine (#921B2F, #AA3234), Coral (#FA947E, #EC7E6F), Midnight (#0B0F19)
 */
export default function HeroScene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a11, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting (Rich Crimson, Coral Gold, and Midnight Ambient)
    const ambientLight = new THREE.AmbientLight(0x1f2942, 1.8);
    scene.add(ambientLight);

    const rubyLight = new THREE.PointLight(0xc43b43, 8, 25);
    rubyLight.position.set(4, 3, 4);
    scene.add(rubyLight);

    const coralLight = new THREE.PointLight(0xfa947e, 6, 20);
    coralLight.position.set(-4, -2, 3);
    scene.add(coralLight);

    const topLight = new THREE.DirectionalLight(0xfff1ec, 2.5);
    topLight.position.set(0, 8, 6);
    scene.add(topLight);

    // 3. Central Sculpted Astrolabe / Celestial Guiding Core (Saarathi Emblem)
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Core Gem / Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x921b2f,
      emissive: 0x350f1c,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    centralGroup.add(coreMesh);

    // Inner Wireframe Structure
    const innerWireGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfa947e,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(innerWireGeo, wireMat);
    centralGroup.add(wireMesh);

    // Orbital Celestial Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xfa947e,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x57192e,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    centralGroup.add(ring1);

    // Orbital Celestial Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xc43b43,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    centralGroup.add(ring2);

    // Orbital Celestial Ring 3 (Outer guide)
    const ring3Geo = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xfff1ec,
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
      opacity: 0.6,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 6;
    centralGroup.add(ring3);

    // 4. Guiding Star Constellation Particles (1,000 points)
    const particleCount = 1000;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = (Math.random() - 0.5) * 14;
      posArray[i + 2] = (Math.random() - 0.5) * 12;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xfa947e,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse Parallax Control
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping mouse movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      centralGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.4;
      centralGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15 + targetY * 0.3;

      // Complex celestial ring spins
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.x = elapsedTime * 0.25;
      ring3.rotation.y = elapsedTime * 0.18;

      // Subtle float motion
      centralGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[460px] md:min-h-[580px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
    />
  );
}
