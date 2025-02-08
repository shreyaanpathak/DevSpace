import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GlitchText = ({ children }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div
      className="relative inline-block"
      animate={isGlitching ? {
        x: [-2, 2, -2, 2, 0],
        y: [1, -1, 1, -1, 0],
      } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative ${isGlitching ? 'after:content-[""] after:absolute after:inset-0 after:bg-current after:opacity-10 after:animate-glitch' : ''}`}>
        {children}
      </div>
      {isGlitching && (
        <>
          <div className="absolute top-0 left-0 w-full h-full text-[#0ff] translate-x-[-2px] opacity-50 mix-blend-screen">
            {children}
          </div>
          <div className="absolute top-0 left-0 w-full h-full text-[#f0f] translate-x-[2px] opacity-50 mix-blend-screen">
            {children}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default GlitchText;
