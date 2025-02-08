import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react"; // <-- Added useState here
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaRocket,
  FaBrain,
  FaGithub,
  FaCube,
  FaChartLine,
  FaLaptopCode,
  FaCode,
} from "react-icons/fa";
import { useTheme } from "./ThemeContext";
import Navbar from "../Navbar";
import FloatingIcons from "./FloatingIcons";
import GlowingOrb from "./GlowingOrb";
import Terminal from "./Terminal";
import MatrixBackground from "./MatrixBackground";
import CircuitBackground from "./CircuitBackground";
import GlitchText from "./GlitchText";
import Starfield from "./Starfield";
import NeuralNetworkCanvas from "./NeuralNetworkCanvas";
import FakeTerminal from "./FakeTerminal";

const FeatureCard = ({ icon: Icon, title, description }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${theme.panel} p-8 rounded-xl hover:bg-white/5 
        transition-all duration-300 group`}
    >
      <Icon className={`text-4xl ${theme.text} mb-4`} />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};


const FutureFeature = ({ icon: Icon, text, color }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-4 text-lg"
  >
    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`text-xl ${color}`} />
    </div>
    <span className="text-gray-300">{text}</span>
  </motion.div>
);

const Section = ({ children, className = "" }) => (
  <section className={`min-h-screen flex items-center relative ${className}`}>
    <div className="max-w-7xl mx-auto px-6 py-24 w-full">{children}</div>
  </section>
);

const Home = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className={`relative ${theme.background}`}>
      {/* Background Effects */}
      <Starfield />
      <MatrixBackground />
      <CircuitBackground />

      {/* Navbar */}
      <Navbar />

      {/* ================== HERO ================== */}
      <div className="min-h-screen flex items-center justify-center sticky top-0">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="text-center space-y-8"
          >
            <GlitchText>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-8xl font-bold tracking-tight bg-gradient-to-r ${theme.primary} 
                  bg-clip-text text-transparent animate-gradient`}
              >
                DevSpace
              </motion.h1>
            </GlitchText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Next-generation GPU development platform for building incredible
              applications
            </motion.p>

            {/* Terminal with improved sizing/scroll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto max-h-64 overflow-y-auto shadow-lg"
            >
              <FakeTerminal />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/signup"
                className={`px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} rounded-lg 
                  text-white font-semibold hover:scale-105 transition-all duration-300 
                  flex items-center gap-2 group shadow-lg shadow-current/25`}
              >
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 ${theme.glass} rounded-lg text-gray-300 
                  font-semibold hover:bg-white/10 transition-all duration-300
                  flex items-center gap-2`}
              >
                <FaGithub className="text-xl" />
                Star on GitHub
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ================== FEATURES ================== */}
      <div className="relative">
        <Section>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className={`text-5xl font-bold mb-6 bg-gradient-to-r ${theme.secondary} 
              bg-clip-text text-transparent`}
            >
              Built for GPU Development
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for parallel computing and CUDA development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaLaptopCode}
              title="Real-Time Collaboration"
              description="Code together in real-time with built-in version control and team features."
            />
            <FeatureCard
              icon={FaCube}
              title="GPU Optimization"
              description="Harness the power of CUDA with intelligent optimization suggestions."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Performance Metrics"
              description="Monitor GPU utilization and performance metrics in real-time."
            />
          </div>
        </Section>

        <Section className={`${theme.glass} relative`}>
          <div className="flex flex-col md:flex-row items-center gap-12 px-6 py-16">
            {/* LEFT TEXT AREA */}
            <div className="w-full md:w-1/2 space-y-6">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`text-4xl font-bold bg-gradient-to-r ${theme.accent} 
          bg-clip-text text-transparent`}
              >
                Write Better Code
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                Advanced code editor with AI-powered suggestions and real-time
                optimization hints. Elevate your workflow with lightning-fast
                debugging and GPU-accelerated builds—perfect for parallel
                programming in C, Java, Python, and beyond.
              </motion.p>
            </div>

            <motion.div
              className="w-full md:w-1/2 hidden md:block"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <NeuralNetworkCanvas />
            </motion.div>
          </div>
        </Section>

        {/* ================== FUTURE FEATURES ================== */}
        <Section className="relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`text-6xl font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
              >
                Built for the Future
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400"
              >
                Experience the next generation of development tools with
                cutting-edge features designed for modern GPU computing and AI
                workloads.
              </motion.p>

              <div className="space-y-6 pt-4">
                <FutureFeature
                  icon={FaRocket}
                  text="Advanced GPU Optimization"
                  color="text-blue-500"
                />
                <FutureFeature
                  icon={FaBrain}
                  text="AI-Powered Code Suggestions"
                  color="text-purple-500"
                />
                <FutureFeature
                  icon={FaCode}
                  text="Real-Time Collaboration"
                  color="text-green-500"
                />
              </div>
            </div>
            <div className="relative">
              <GlowingOrb className="absolute inset-0 opacity-20" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`${theme.panel} rounded-xl overflow-hidden shadow-2xl`}
              >
                <div className="bg-gray-900/50 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-sm">DevSpace</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <Terminal />
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ================== CALL TO ACTION ================== */}
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <GlitchText>
              <h2
                className={`text-5xl font-bold bg-gradient-to-r ${theme.primary} 
                  bg-clip-text text-transparent`}
              >
                Ready to Get Started?
              </h2>
            </GlitchText>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join our community of developers and start building amazing
              applications today.
            </p>
            <div className="flex justify-center gap-6 mt-12">
              <Link
                to="/signup"
                className={`px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} rounded-lg
                  text-white font-semibold hover:scale-105 transition-all duration-300
                  flex items-center gap-2 group shadow-lg shadow-current/25`}
              >
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* Floating Icons */}
      <FloatingIcons />
    </div>
  );
};

export default Home;
