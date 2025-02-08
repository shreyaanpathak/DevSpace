import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useEffect } from 'react';

const GlowingOrb = ({ className, colorIndex = 0 }) => {
  const { theme } = useTheme();

  useEffect(() => {
    console.log("✅ GlowingOrb Mounted");
  }, []);

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute z-0 rounded-full backdrop-blur-3xl ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${theme.orbColors[colorIndex]}, transparent)`,
      }}
    />
  );
};

export default GlowingOrb;
