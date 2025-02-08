import { motion } from 'framer-motion';
import { FaReact, FaPython, FaDocker, FaGithub } from 'react-icons/fa';
import { SiTensorflow, SiKubernetes } from 'react-icons/si';

const FloatingIcons = () => {
  const icons = [
    { Icon: FaReact, x: '10%', y: '20%', duration: 8 },
    { Icon: FaPython, x: '80%', y: '15%', duration: 9 },
    { Icon: FaDocker, x: '70%', y: '70%', duration: 7 },
    { Icon: FaGithub, x: '20%', y: '80%', duration: 10 },
    { Icon: SiTensorflow, x: '90%', y: '40%', duration: 8 },
    { Icon: SiKubernetes, x: '15%', y: '60%', duration: 9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-400/20 text-4xl"
          initial={{ x: item.x, y: item.y }}
          animate={{
            y: [`${item.y}`, `${parseFloat(item.y) + 5}%`, `${item.y}`],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;