import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext"; 

export default function NeuralNetworkCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    
    const color1 = theme.orbColors[0] || "96,165,250";
    const color2 = theme.orbColors[1] || "99,102,241";

   
    const nodeColor = `rgb(${color1})`;         
    const edgeColor = `rgba(${color1}, 0.3)`;   
    const pulseColor = `rgb(${color2})`;        

    const numNodes = 20; 
    const nodes = [];
    const edges = [];

   
    const speedMin = 0.3;
    const speedMax = 0.6;

    function randomSpeed() {
      return Math.random() * (speedMax - speedMin) + speedMin;
    }

    function createNodes(width, height) {
      for (let i = 0; i < numNodes; i++) {
        // random position
        const x = Math.random() * width;
        const y = Math.random() * height;

        // random direction
        const angle = Math.random() * 2 * Math.PI;
        const spd = randomSpeed();
        const vx = Math.cos(angle) * spd;
        const vy = Math.sin(angle) * spd;

        nodes.push({
          x,
          y,
          vx,
          vy,
          radius: 5 + Math.random() * 3,
          color: nodeColor,
        });
      }
    }

    function createEdges() {
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          if (Math.random() < 0.15) {
            edges.push({ from: i, to: j });
          }
        }
      }
    }

    let pulses = [];

    // ======= ANIMATION LOOP =======
    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1) Move Nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at edges
        if (node.x < node.radius) {
          node.x = node.radius;
          node.vx *= -1;
        } else if (node.x > canvas.width - node.radius) {
          node.x = canvas.width - node.radius;
          node.vx *= -1;
        }
        if (node.y < node.radius) {
          node.y = node.radius;
          node.vy *= -1;
        } else if (node.y > canvas.height - node.radius) {
          node.y = canvas.height - node.radius;
          node.vy *= -1;
        }
      });

      // 2) Draw edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = edgeColor;
      edges.forEach((edge) => {
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      });

      // 3) Draw pulses
      pulses.forEach((pulse, index) => {
        const n1 = nodes[pulse.from];
        const n2 = nodes[pulse.to];
        const progress = pulse.t / pulse.duration;
        const x = n1.x + (n2.x - n1.x) * progress;
        const y = n1.y + (n2.y - n1.y) * progress;

        // Draw pulse circle
        ctx.beginPath();
        ctx.fillStyle = pulseColor; // pulses use color2 
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        pulse.t++;
        if (pulse.t > pulse.duration) {
          pulses.splice(index, 1);
        }
      });

      // 4) Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5) Occasionally spawn pulses
      if (Math.random() < 0.02 && edges.length > 0) {
        const edgeIndex = Math.floor(Math.random() * edges.length);
        const edge = edges[edgeIndex];
        pulses.push({
          from: edge.from,
          to: edge.to,
          t: 0,
          duration: 60 + Math.random() * 60,
        });
      }
    }

    function onResize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", onResize);
    onResize(); // initial

    createNodes(canvas.width, canvas.height);
    createEdges();

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <div className="relative w-full h-72 md:h-80 lg:h-96 mx-auto">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}
