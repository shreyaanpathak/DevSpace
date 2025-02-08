import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

const Home = () => {
  const [theme, setTheme] = useState('light');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const terminalCommands = [
    'devspace init my-project', 1000,
    'Creating workspace...', 1000,
    'Setting up CUDA environment...', 1000,
    'Ready to code! 🚀', 1000,
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar fixed top-0 z-50 bg-base-100/80 backdrop-blur-xl border-b border-base-200">
        <div className="container mx-auto px-6">
          <div className="flex-1">
            <Link to="/" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end bg-clip-text text-transparent">
                DevSpace
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <Link 
              to="/login" 
              className="btn btn-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[90vh] pt-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-4xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full filter blur-4xl animate-pulse-slow" />
        </div>

        <AnimatePresence>
          {isVisible && (
            <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16 justify-between">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex-1 max-w-2xl"
                >
                  <h1 className="text-6xl font-bold mb-8 leading-tight text-shadow-lg">
                    <span className="bg-gradient-to-r from-primary-gradient-start via-accent to-primary-gradient-end bg-clip-text text-transparent animate-gradient">
                      Next-Gen GPU Development Platform
                    </span>
                  </h1>
                  <p className="text-xl mb-12 text-base-content/80 leading-relaxed">
                    Experience seamless collaboration, real-time performance metrics, and AI-powered insights for parallel programming and GPU computing.
                  </p>
                  <div className="flex gap-6">
                    <Link 
                      to="/signup" 
                      className="btn btn-primary shadow-glow group"
                    >
                      Get Started
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/demo" 
                      className="btn btn-outline btn-primary"
                    >
                      Live Demo
                    </Link>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="flex-1 max-w-lg"
                >
                  <div className="mockup-code bg-neutral text-neutral-content shadow-glow-lg">
                    <div className="px-4 py-3 flex items-center gap-2 bg-base-300/10">
                      <div className="w-3 h-3 rounded-full bg-error"></div>
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                    </div>
                    <div className="p-6 font-mono">
                      <TypeAnimation
                        sequence={terminalCommands}
                        wrapper="div"
                        cursor={true}
                        repeat={Infinity}
                        style={{ fontSize: '1rem' }}
                        className="leading-loose"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Home;