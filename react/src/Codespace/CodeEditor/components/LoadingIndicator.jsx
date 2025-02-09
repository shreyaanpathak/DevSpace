// CodeEditor/components/LoadingIndicator.jsx
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";

const LoadingIndicator = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: theme.monacoBackground }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      >
        <FaCode className={`text-4xl ${theme.text}`} />
      </motion.div>
    </motion.div>
  );
};

export default LoadingIndicator;