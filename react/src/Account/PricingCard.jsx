import { motion } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { FiCheck } from "react-icons/fi";

const PricingCard = ({ plan, selected, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        p-5 rounded-lg cursor-pointer
        backdrop-blur-sm bg-white/5
        border-2 transition-all duration-300
        ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-white/10'}
      `}
    >
      <div className="text-xl font-bold text-white mb-1">
        {plan.name}
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-2xl font-bold text-white">{plan.price}</span>
        <span className="text-gray-400 ml-1 text-sm">{plan.period}</span>
      </div>
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300 text-sm">
            <FiCheck className="w-4 h-4 mr-2 text-blue-500" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PricingCard;
