import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AuroraBackground = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full overflow-hidden bg-paper-white dark:bg-slate-ink transition-colors duration-300",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Mesh Gradients */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 dark:opacity-20 blur-[100px] will-change-transform">
             {/* Mint Green Blob */}
            <motion.div
              animate={{
                transform: [
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                  "translate(10%, -5%) rotate(10deg) scale(1.1)",
                  "translate(-5%, 10%) rotate(-10deg) scale(0.9)",
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute top-[20%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-[#4FC3A0] mix-blend-multiply dark:mix-blend-screen"
            />
            
            {/* Aqua Green Blob */}
            <motion.div
              animate={{
                transform: [
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                  "translate(-10%, 15%) rotate(-15deg) scale(1.2)",
                  "translate(5%, -10%) rotate(15deg) scale(0.8)",
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                ],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute top-[30%] right-[25%] w-[35vw] h-[35vw] rounded-full bg-[#69D6C1] mix-blend-multiply dark:mix-blend-screen"
            />

            {/* Dark Mint/Blue Blob */}
            <motion.div
              animate={{
                transform: [
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                  "translate(15%, 5%) rotate(20deg) scale(1.1)",
                  "translate(-10%, -5%) rotate(-20deg) scale(0.9)",
                  "translate(0%, 0%) rotate(0deg) scale(1)",
                ],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute bottom-[10%] left-[40%] w-[45vw] h-[45vw] rounded-full bg-[#3DAF8A] mix-blend-multiply dark:mix-blend-screen"
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default AuroraBackground;