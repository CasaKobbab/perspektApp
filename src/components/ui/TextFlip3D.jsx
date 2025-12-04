import React from "react";
import { motion } from "framer-motion";

/**
 * TextFlip3D
 * A minimalist 3D text flip animation component.
 * Letters rotate 360 degrees on the X-axis sequentially.
 * 
 * @param {string} children - The text to animate
 * @param {string} className - CSS classes for the container
 */
const TextFlip3D = ({ children, className = "" }) => {
  const text = typeof children === "string" ? children : "";
  const characters = text.split("");

  return (
    <span
      className={`inline-flex flex-wrap items-center justify-center ${className}`}
      style={{ perspective: "1000px" }}
      aria-label={text}
    >
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block transform-style-3d whitespace-pre"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 360 }}
          transition={{
            duration: 1.2,
            delay: i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth easeOutQuad-ish curve
            repeat: Infinity,
            repeatDelay: 8, // Long pause for "Swiss" minimalist feel (not frantic)
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default TextFlip3D;