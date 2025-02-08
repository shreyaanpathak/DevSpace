import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Home/ThemeContext";
import { FiMenu, FiX } from "react-icons/fi";

const NavLink = ({ to, children, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        onClick={onClick} 
        className={`block px-4 py-2 rounded-lg relative group overflow-hidden
          ${theme.glass} transition-all duration-300`}
      >
        <span className="relative z-10 text-gray-200">{children}</span>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-0
            group-hover:opacity-20 transition-opacity duration-300`}
        />
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FIXED NAV WRAPPER */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center
          backdrop-blur-sm
          ${theme.glass} 
          border-b border-white/10
          h-20
        `}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.primary}`}
            />
            <span
              className={`text-2xl font-bold bg-gradient-to-r ${theme.primary} 
                bg-clip-text text-transparent`}
            >
              DevSpace
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            {/* THEME SELECTOR */}
            <div className="flex items-center gap-2">
              {Object.entries(themes).map(([key, value]) => {
                const isActive = theme.name === value.name;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTheme(key)}
                    className={`
                      w-7 h-7 rounded-full 
                      border border-white/20
                      bg-gradient-to-r ${value.buttonGradient}
                      transition-all duration-300
                      outline-none
                      ${isActive ? "ring-2 ring-offset-2 ring-blue-400" : ""}
                    `}
                  />
                );
              })}
              <NavLink to="/pricing">Pricing</NavLink>
            </div>

            {/* LOGIN BUTTON */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/Signin"
                className={`px-5 py-2 rounded-lg bg-gradient-to-r ${theme.primary}
                  text-white font-medium hover:opacity-90 transition-opacity`}
              >
                Login
              </Link>
            </motion.div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden p-2 text-gray-200"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween" }}
            className={`
              md:hidden 
              pt-20  /* push below fixed nav so we don't overlap logo */
              pb-4 
              w-full 
              backdrop-blur-sm
              ${theme.glass}
              border-b border-white/10
              z-40
              fixed top-0 left-0
            `}
          >
            <div className="px-6 space-y-4">
              <NavLink to="/pricing" onClick={() => setIsOpen(false)}>
                Pricing
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
