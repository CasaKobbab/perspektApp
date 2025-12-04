import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export const AuroraButton = ({ children, className, onClick, ...props }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.button
      className={`relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${className || ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Spotlight Border */}
      <motion.div
        className="absolute inset-0 rounded-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, rgba(82, 227, 164, 1), transparent 80%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />
      {/* Base Background - Dark for better aurora contrast */}
      <div className="absolute inset-0 bg-slate-900" />

      {/* Aurora Mesh Gradients */}
      <div className="absolute inset-0 blur-2xl">
        {/* Primary Brand Color (Mint) */}
        <motion.div
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] rounded-full bg-[radial-gradient(circle,rgba(79,195,160,0.6)_0%,transparent_60%)]"
          animate={{
            transform: [
              "rotate(0deg) translate(0, 0)", 
              "rotate(90deg) translate(10%, 10%)", 
              "rotate(180deg) translate(0, 0)", 
              "rotate(270deg) translate(-10%, -10%)", 
              "rotate(360deg) translate(0, 0)"
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Secondary Brand Color (Aqua) */}
        <motion.div
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] rounded-full bg-[radial-gradient(circle,rgba(105,214,193,0.5)_0%,transparent_50%)] mix-blend-screen"
          animate={{
            transform: [
              "rotate(360deg) translate(0, 0)", 
              "rotate(270deg) translate(-15%, 5%)", 
              "rotate(180deg) translate(0, 0)", 
              "rotate(90deg) translate(15%, -5%)", 
              "rotate(0deg) translate(0, 0)"
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Highlight (White/Bright Mint) */}
        <motion.div
          className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-[radial-gradient(circle,rgba(82,227,164,0.3)_0%,transparent_70%)] mix-blend-overlay"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            x: ["0%", "10%", "-5%", "0%"],
            y: ["0%", "-10%", "5%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full">
        {children}
      </div>
    </motion.button>
  );
};

export default AuroraButton;