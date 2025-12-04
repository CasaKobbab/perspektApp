import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const SpotlightBackground = () => {
  const { scrollY } = useScroll();
  // Moves vertically opposite to scroll direction
  // When scrolling down (scrollY increases), the background moves up (negative y)
  const y = useTransform(scrollY, [0, 2000], [0, -800], { clamp: false });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute left-0 right-0 h-[150vh] -top-[25vh] w-full"
      >
        {/* Dark Mode: Light Glow (Mint/Aqua tint) */}
        <div className="hidden dark:block w-full h-full bg-[radial-gradient(circle_at_center,_rgba(79,195,160,0.15)_0%,_transparent_60%)] blur-3xl opacity-80" />

        {/* Light Mode: Dark Vignette (Subtle shadow spotlight) */}
        <div className="dark:hidden w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.08)_0%,_transparent_60%)] blur-3xl opacity-60" />
      </motion.div>
    </div>
  );
};

export default SpotlightBackground;