import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Home/ThemeContext";
import { FiMenu, FiX, FiUser, FiCode, FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../Account/accountReducer";
import * as client from "../Account/client";

const NavLink = ({ to, children, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        onClick={onClick} 
        className={`
          block px-6 py-2.5 rounded-lg relative group overflow-hidden
          ${theme.glass} transition-all duration-300
          hover:shadow-lg hover:shadow-white/5
        `}
      >
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
            className="fixed inset-0 z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
            className={`
              absolute right-0 mt-2 w-56 rounded-xl
              border border-white/10 overflow-hidden
              backdrop-blur-md shadow-2xl
              bg-black/40
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

const Navbar = () => {
  const { theme, setTheme, themes } = useTheme();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.account?.currentUser ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
        transition={{ type: "spring", stiffness: 70 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-md
          ${theme.glass} 
          border-b border-white/10
          h-20
          shadow-lg shadow-black/5
        `}
      >
        <div className="max-w-7xl mx-auto px-8 h-full w-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`w-10 h-10 rounded-xl bg-gradient-to-r ${theme.primary}
                shadow-lg shadow-primary/20`}
            />
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
                {Object.entries(themes).map(([key, value]) => {
                  const isActive = theme.name === value.name;
                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTheme(key)}
                      className={`
                        w-8 h-8 rounded-lg
                        border border-white/20
                        bg-gradient-to-r ${value.buttonGradient}
                        transition-all duration-300
                        outline-none shadow-lg
                        ${isActive ? "ring-2 ring-offset-2 ring-offset-black ring-blue-400" : ""}
                      `}
                    />
                  );
                })}
              </div>
              {currentUser ? (
                <NavLink to="/devspaces">DevSpaces</NavLink>
              ) : (
                <NavLink to="/pricing">Pricing</NavLink>
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
                  <span className="font-medium text-sm">Account</span>
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
                        <span className="w-5 h-5 mr-3">
                          <FiUser />
                        </span>
                        Profile Settings
                      </Link>
                      
                      <Link
                        to="/devspaces"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-200
                          hover:bg-white/10 transition-colors duration-200"
                      >
                        <span className="w-5 h-5 mr-3">
                          <FiCode />
                        </span>
                        My DevSpaces
                      </Link>
                    </div>
                    
                    <div className="border-t border-white/10 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400
                          hover:bg-white/10 transition-colors duration-200"
                      >
                        <span className="w-5 h-5 mr-3">
                          <FiLogOut />
                        </span>
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
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween" }}
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
                <NavLink to="/devspaces" onClick={() => setIsOpen(false)}>
                  DevSpaces
                </NavLink>
              ) : (
                <NavLink to="/pricing" onClick={() => setIsOpen(false)}>
                  Pricing
                </NavLink>
              )}
              {currentUser && (
                <>
                  <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-6 py-2.5 text-gray-200 hover:bg-white/10
                      rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
