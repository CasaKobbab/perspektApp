import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Calculate distance from mouse position to current UV
  float dist = distance(uv, uMouse);
  
  // Create a localized distortion effect
  // Strength decreases with distance from mouse
  float strength = smoothstep(0.3, 0.0, dist) * 0.02 * uHover;
  
  // Wavy distortion
  vec2 distortion = vec2(
    sin(uv.y * 20.0 + uTime * 4.0),
    cos(uv.x * 20.0 + uTime * 4.0)
  ) * strength;
  
  uv += distortion;
  
  gl_FragColor = texture2D(uTexture, uv);
}
`;

export const LiquidText = ({ text, highlight, className = "" }) => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, 1, 1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Canvas for Text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Scale for retina
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // Check breakpoints
    const isLg = window.innerWidth >= 1024;
    
    // Font styling
    const fontSize = isLg ? 60 : 32;
    ctx.font = `bold ${fontSize}px serif`; // Matching font-serif
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Colors
    const textColor = theme === 'dark' ? '#ffffff' : '#1A1A1A';
    
    // Draw Logic
    if (isLg) {
        // Desktop: Two lines
        ctx.fillStyle = textColor;
        ctx.fillText(text, centerX, centerY - fontSize * 0.6);
        
        // Highlight Gradient
        const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
        gradient.addColorStop(0, '#4FC3A0'); // Mint
        gradient.addColorStop(1, '#69D6C1'); // Aqua
        ctx.fillStyle = gradient;
        ctx.fillText(highlight.toUpperCase(), centerX, centerY + fontSize * 0.8);
    } else {
        // Mobile: Stacked or wrapped? Let's stick to simple stacking for safety
        ctx.fillStyle = textColor;
        ctx.fillText(text, centerX, centerY - fontSize * 0.7);
        
        const gradient = ctx.createLinearGradient(centerX - 50, 0, centerX + 50, 0);
        gradient.addColorStop(0, '#4FC3A0');
        gradient.addColorStop(1, '#69D6C1');
        ctx.fillStyle = gradient;
        ctx.fillText(highlight.toUpperCase(), centerX, centerY + fontSize * 0.7);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Mesh
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTexture: { value: texture }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Animation
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      // Decay hover effect
      // material.uniforms.uHover.value = THREE.MathUtils.lerp(material.uniforms.uHover.value, 0, 0.05);
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse Handling
    const handleMouseMove = (e) => {
        const rect = mount.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        
        material.uniforms.uMouse.value.set(x, y);
        material.uniforms.uHover.value = 1.0; // Activate distortion
    };

    const handleMouseLeave = () => {
        material.uniforms.uHover.value = 0.0;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // Resize handler
    const handleResize = () => {
        // Simple reload for now or update renderer
        width = mount.clientWidth;
        height = mount.clientHeight;
        renderer.setSize(width, height);
        camera.left = width / -2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        camera.updateProjectionMatrix();
        // Ideally redraw canvas text here too
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [text, highlight, theme]);

  return <div ref={mountRef} className={className} />;
};