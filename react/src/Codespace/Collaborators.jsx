// Collaborators.jsx
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";

const Collaborators = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="p-2 text-gray-400 text-sm">
        No active collaborators
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {users.map((user, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, x: 5 }}
          className="flex items-center gap-3 p-2 hover:bg-white/3 border border-transparent 
            hover:border-white/5 transition-all duration-200"
        >
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: user.color }}
          />
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <FaUser className="text-gray-400" />
          </motion.div>
          <span 
            className="text-gray-300 text-sm"
            style={{ color: user.color }}
          >
            {user.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Collaborators;