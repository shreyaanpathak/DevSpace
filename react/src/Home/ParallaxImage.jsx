import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

const ParallaxImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  useEffect(() => {
    console.log("✅ ParallaxImage Mounted");
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden h-[60vh] z-10">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ParallaxImage;
