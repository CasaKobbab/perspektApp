import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BreathingText({ 
  text, 
  className = "", 
  fromWeight = 400, 
  toWeight = 700,
  duration = 1.5,
  stagger = 0.05,
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = Array.from(text);

  return (
    <motion.span 
      className={`inline-block cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ fontVariationSettings: `'wght' ${fromWeight}` }}
    >
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ 
             display: 'inline-block',
             whiteSpace: 'pre',
          }}
          animate={{
            fontVariationSettings: isHovered ? `'wght' ${toWeight}` : `'wght' ${fromWeight}`,
          }}
          transition={{
            duration: duration,
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * stagger,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}