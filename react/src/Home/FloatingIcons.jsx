import { motion, useScroll, useTransform } from "framer-motion";
import { FaReact, FaPython, FaDocker, FaGithub, FaCode } from "react-icons/fa";
import { SiTensorflow, SiNvidia, SiPytorch, SiJavascript } from "react-icons/si";

// Icon configuration array with unique ids and animation settings
const icons = [
  { id: "react", Icon: FaReact, initialX: 20, initialY: 20, size: 40, duration: 8 },
  { id: "python", Icon: FaPython, initialX: 80, initialY: 15, size: 35, duration: 9 },
  { id: "docker", Icon: FaDocker, initialX: 70, initialY: 70, size: 45, duration: 7 },
  { id: "github", Icon: FaGithub, initialX: 25, initialY: 80, size: 30, duration: 10 },
  { id: "tensorflow", Icon: SiTensorflow, initialX: 90, initialY: 40, size: 40, duration: 8 },
  { id: "nvidia", Icon: SiNvidia, initialX: 15, initialY: 60, size: 35, duration: 9 },
  { id: "pytorch", Icon: SiPytorch, initialX: 85, initialY: 75, size: 30, duration: 8 },
  { id: "javascript", Icon: SiJavascript, initialX: 30, initialY: 35, size: 40, duration: 9 },
  { id: "code", Icon: FaCode, initialX: 45, initialY: 85, size: 35, duration: 7 },
];

const FloatingIcons = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
    >
      {icons.map(({ id, Icon, initialX, initialY, size, duration }) => (
        <motion.div
          key={id}
          className="fixed text-gray-400/50"
          initial={{ x: `${initialX}vw`, y: `${initialY}vh` }}
          animate={{
            x: [`${initialX}vw`, `${initialX + 5}vw`, `${initialX}vw`],
            y: [`${initialY}vh`, `${initialY + 5}vh`, `${initialY}vh`],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ fontSize: size }}
        >
          <Icon />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FloatingIcons;
