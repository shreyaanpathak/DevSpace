import { motion } from 'framer-motion';
import { FaReact, FaPython, FaDocker, FaGithub, FaCode } from 'react-icons/fa';
import { SiTensorflow, SiKubernetes, SiJavascript, SiTypescript } from 'react-icons/si';
import { useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';

const FloatingIcons = () => {
  const icons = [
    { Icon: FaReact, initialX: 20, initialY: 20, size: 40, duration: 8 },
    { Icon: FaPython, initialX: 80, initialY: 15, size: 35, duration: 9 },
    { Icon: FaDocker, initialX: 70, initialY: 70, size: 45, duration: 7 },
    { Icon: FaGithub, initialX: 25, initialY: 80, size: 30, duration: 10 },
    { Icon: SiTensorflow, initialX: 90, initialY: 40, size: 40, duration: 8 },
    { Icon: SiKubernetes, initialX: 15, initialY: 60, size: 35, duration: 9 },
    { Icon: SiJavascript, initialX: 85, initialY: 75, size: 30, duration: 8 },
    { Icon: SiTypescript, initialX: 30, initialY: 35, size: 40, duration: 9 },
    { Icon: FaCode, initialX: 45, initialY: 85, size: 35, duration: 7 },
  ];

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setVisible(value < 0.1); // Hide icons if scrolled more than 10% of the page
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
    >
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="fixed text-gray-400/50"
          initial={{ x: `${item.initialX}vw`, y: `${item.initialY}vh` }}
          animate={{
            x: [`${item.initialX}vw`, `${item.initialX + 5}vw`, `${item.initialX}vw`],
            y: [`${item.initialY}vh`, `${item.initialY + 5}vh`, `${item.initialY}vh`],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ fontSize: item.size }}
        >
          <item.Icon />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FloatingIcons;
