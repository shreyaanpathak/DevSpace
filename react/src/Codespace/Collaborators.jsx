import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";

const Collaborators = () => {
  const dispatch = useDispatch();
  
  // Get collaborators from Redux state
  const collaborators = useSelector(state => state.repository.collaborators);
  const loading = useSelector(state => state.repository.loading);
  const currentUserId = useSelector(state => state.account.user?.id);

  // Optional: Update collaborator status in real-time
  const updateCollaboratorStatus = (userId, status) => {
    dispatch({
      type: 'repository/UPDATE_COLLABORATOR_STATUS',
      payload: { userId, status }
    });
  };

  if (loading) {
    return (
      <div className="p-2 text-gray-400 text-sm">
        Loading collaborators...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {collaborators.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, x: 5 }}
          className={`flex items-center gap-3 p-2 hover:bg-white/3 border border-transparent 
            hover:border-white/5 transition-all duration-200
            ${currentUserId === user.id ? 'bg-white/5' : ''}`}
        >
          <motion.div 
            animate={user.status === 'active' ? {
              scale: [1, 1.2, 1],
              transition: { repeat: Infinity, duration: 2 }
            } : {}}
            className={`w-2 h-2 rounded-full ${
              user.status === 'active' ? 'bg-green-500' :
              user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} 
          />
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <FaUser className="text-gray-400" />
          </motion.div>
          <span className="text-gray-300 text-sm">
            {user.name} {currentUserId === user.id ? '(You)' : ''}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Collaborators;