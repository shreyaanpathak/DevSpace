import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Home/ThemeContext";
import { FiMenu, FiX, FiUser, FiCode, FiLogOut, FiHome, FiSettings, FiGrid, FiBriefcase, FiBook, FiAward } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../Account/accountReducer";
import * as client from "../Account/client";

const LogoAnimation = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div className="relative w-10 h-10">
      {/* Background circle */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${theme.primary}`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Code bracket elements */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-6 h-6">
          {/* Left bracket */}
          <motion.div
            className="absolute left-0 w-2.5 h-full bg-white rounded-sm"
            animate={{
              x: [-2, 2, -2],
              rotate: [-15, 15, -15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Right bracket */}
          <motion.div
            className="absolute right-0 w-2.5 h-full bg-white rounded-sm"
            animate={{
              x: [2, -2, 2],
              rotate: [15, -15, 15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const NavLink = ({ to, children, onClick, icon: Icon }) => {
  const { theme } = useTheme();

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link
        to={to}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-6 py-2.5 rounded-xl
          relative group overflow-hidden
          ${theme.glass} transition-all duration-300
          hover:shadow-lg hover:shadow-white/5
        `}
      >
        {Icon && <Icon className="text-gray-400 group-hover:text-gray-200 transition-colors" />}
        <span className="relative z-10 text-gray-200 font-medium">{children}</span>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-0
            group-hover:opacity-30 transition-opacity duration-300`}
        />
      </Link>
    </motion.div>
  );
};

const ProfileDropdown = ({ isOpen, onClose, children }) => {
  const { theme } = useTheme();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              absolute right-0 mt-2 w-64 rounded-xl
              ${theme.glass} backdrop-blur-xl
              border border-white/10 overflow-hidden
              shadow-2xl shadow-black/20
              z-50
            `}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ThemeButton = ({ theme: themeKey, value, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        w-8 h-8 rounded-lg relative
        border border-white/20
        bg-gradient-to-r ${value.buttonGradient}
        transition-all duration-300
        outline-none shadow-lg
        ${isActive ? "ring-2 ring-offset-2 ring-offset-black ring-blue-400" : ""}
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeTheme"
          className="absolute inset-0 rounded-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
        />
      )}
    </motion.button>
  );
};

const Navbar = () => {
  const { theme, setTheme, themes } = useTheme();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.account?.currentUser ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-md
          ${theme.glass} 
          border-b border-white/10
          h-20
          ${isScrolled ? 'shadow-lg shadow-black/10' : ''}
          transition-all duration-300
        `}
      >
        <div className="max-w-7xl mx-auto px-8 h-full w-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3"
            onClick={() => setIsOpen(false)}
          >
            <LogoAnimation />
            <span
              className={`text-2xl font-bold bg-gradient-to-r ${theme.primary} 
                bg-clip-text text-transparent tracking-tight`}
            >
              DevSpace
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-2 bg-white/5 p-1.5 rounded-lg">
                {Object.entries(themes).map(([key, value]) => (
                  <ThemeButton
                    key={key}
                    theme={key}
                    value={value}
                    isActive={theme.name === value.name}
                    onClick={() => setTheme(key)}
                  />
                ))}
              </div>
              {currentUser ? (
                <NavLink to="/devspaces" icon={FiCode}>DevSpaces</NavLink>
              ) : (
                <NavLink to="/pricing" icon={FiBriefcase}>Pricing</NavLink>
              )}
            </div>

            {currentUser ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`
                    p-3 rounded-lg
                    ${theme.glass}
                    text-gray-200
                    hover:bg-white/5
                    transition-all duration-300
                    flex items-center gap-2
                  `}
                >
                  <FiUser size={20} />
                  <span className="font-medium text-sm">{currentUser.username}</span>
                </motion.button>

                <ProfileDropdown 
                  isOpen={showProfileMenu} 
                  onClose={() => setShowProfileMenu(false)}
                >
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-gray-200">
                        {currentUser.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {currentUser.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-200
                          hover:bg-white/10 transition-colors duration-200"
                      >
                        <FiUser className="w-5 h-5 mr-3" />
                        Profile Settings
                      </Link>
                      
                      <Link
                        to="/devspaces"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-200
                          hover:bg-white/10 transition-colors duration-200"
                      >
                        <FiCode className="w-5 h-5 mr-3" />
                        My DevSpaces
                      </Link>
                    </div>
                    
                    <div className="border-t border-white/10 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400
                          hover:bg-white/10 transition-colors duration-200"
                      >
                        <FiLogOut className="w-5 h-5 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </ProfileDropdown>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signin"
                  className={`px-6 py-2.5 rounded-lg bg-gradient-to-r ${theme.primary}
                    text-white font-medium hover:opacity-90 transition-all duration-300
                    shadow-lg shadow-primary/20`}
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden p-3 text-gray-200 hover:bg-white/5 rounded-lg
              transition-colors duration-300"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`
              md:hidden 
              pt-24
              pb-6 
              w-full 
              backdrop-blur-md
              ${theme.glass}
              border-b border-white/10
              z-40
              fixed top-0 left-0
              shadow-lg shadow-black/5
            `}
          >
            <div className="px-8 space-y-4">
              {currentUser ? (
                <>
                  <NavLink to="/devspaces" icon={FiCode} onClick={() => setIsOpen(false)}>
                    DevSpaces
                  </NavLink>
                  <NavLink to="/profile" icon={FiUser} onClick={() => setIsOpen(false)}>
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-2.5 text-red-400 hover:bg-white/10
                      rounded-lg transition-colors duration-200"
                  >
                    <FiLogOut />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <NavLink to="/pricing" icon={FiBriefcase} onClick={() => setIsOpen(false)}>
                  Pricing
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
