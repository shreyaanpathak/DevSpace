import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

const CircuitBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    console.log("✅ CircuitBackground Mounted");
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not found!");
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x, y) => ({
      x, y,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      life: 255
    });

    const drawCircuit = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < 50) {
        particles.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      particles = particles.filter((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.5;

        if (particle.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${theme.orbColors[0]}, 0.3)`;
        ctx.fill();
        return true;
      });

      animationFrameId = requestAnimationFrame(drawCircuit);
    };

    window.addEventListener('resize', resize);
    resize();
    drawCircuit();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20 -z-50" />
  );
};

export default CircuitBackground;
