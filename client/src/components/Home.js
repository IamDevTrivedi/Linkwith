import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link2, ArrowRight } from "lucide-react";
import { Link as LINK } from "react-router-dom";

function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);


    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);


    const textureLoader = new THREE.TextureLoader();
    const qrTexture = textureLoader.load("/qr-code-texture.png");
    const qrMaterial = new THREE.MeshBasicMaterial({ map: qrTexture });
    const qrGeometry = new THREE.PlaneGeometry(5, 5);
    const qrCode = new THREE.Mesh(qrGeometry, qrMaterial);
    qrCode.position.set(0, 0, -15);
    scene.add(qrCode);


    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x00ccff,
      opacity: 0.8,
      transparent: true,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);


    camera.position.z = 20;


    const animate = () => {
      qrCode.rotation.y += 0.01;
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();


    return () => {
      if (renderer) {
        renderer.dispose();
      }
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}

export default function Home() {

  document.title = "Linkwith | Shorten URLs with Ease";

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Three.js Animation */}
      <ThreeScene />

      {/* Overlay to enhance text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24 h-screen flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-sky-400/30 rounded-full animate-spin-slow"></div>
              <div className="relative bg-sky-400/20 p-6 rounded-full">
                <Link2 className="h-16 w-16 md:h-24 md:w-24 text-sky-400 animate-pulse-slow" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Shorten Links with Ease using{" "}
              <span className="text-sky-400">Linkwith</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
              Transform long, complex URLs into short, memorable links. Track
              clicks, generate QR codes, and share with absolute confidence.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center md:justify-start">
              <LINK
                to="/generate-url"
                className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-sky-400 text-black font-semibold text-lg rounded-md transition duration-300 hover:bg-black hover:text-sky-400 hover:border hover:border-sky-400"
              >
                Shorten URL
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </LINK>
              <LINK
                to="/generate-qr"
                className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 text-sky-400 border border-sky-400 font-semibold text-lg rounded-md transition duration-300 hover:bg-sky-400 hover:text-black"
              >
                Generate QR Code
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </LINK>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
