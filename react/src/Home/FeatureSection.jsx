import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${theme.panel} p-8 rounded-xl hover:bg-white/5 
        transition-all duration-300 group`}
    >
      <Icon className={`text-4xl ${theme.text} mb-4`} />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
