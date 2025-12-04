import React, { useRef } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

export const VelocityPrismBackground = ({ className }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300
  });

  // Map velocity to horizontal offset for RGB channels
  const xRed = useTransform(smoothVelocity, [-2000, 2000], [-20, 20]);
  const xBlue = useTransform(smoothVelocity, [-2000, 2000], [20, -20]);
  
  // Opacity increases with velocity (optional, or just always visible but shifting)
  // Let's keep it visible but the shift implies the "glitch"
  
  // Skew effect based on velocity
  const skew = useTransform(smoothVelocity, [-2000, 2000], [-10, 10]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {/* Base Grid (Green Channel / Anchor) */}
        <motion.div 
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-10"
        />
        <motion.div
          className="absolute inset-0"
          style={{ skewX: skew }}
        >
            {/* Cyberpunk Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </motion.div>

        {/* Red Channel - Shifts Left/Right */}
        <motion.div
          className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen"
          style={{ x: xRed, skewX: skew }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,0,0.3)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </motion.div>

        {/* Blue Channel - Shifts Right/Left */}
        <motion.div
          className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen"
          style={{ x: xBlue, skewX: skew }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </motion.div>
      </div>
    </div>
  );
};

export default VelocityPrismBackground;