import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useEffect } from 'react';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    console.log("✅ ThemeSwitcher Mounted");
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 right-6 z-50 flex gap-2"
    >
      {Object.entries(themes).map(([key, value]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(key)}
          className={`p-3 rounded-full backdrop-blur-sm border border-white/20 shadow-lg 
            ${theme.name === value.name ? 'ring-2 ring-offset-2 ring-' + value.text : ''}
            bg-gradient-to-r ${value.buttonGradient}`}
        />
      ))}
    </motion.div>
  );
};

export default ThemeSwitcher;
