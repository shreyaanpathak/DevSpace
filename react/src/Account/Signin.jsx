import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "../Home/ThemeContext";
import { setCurrentUser } from "./accountReducer";
import Navbar from "../Navbar";
import Starfield from "../Home/Starfield";
import MatrixBackground from "../Home/MatrixBackground";
import CircuitBackground from "../Home/CircuitBackground";

export default function Signin() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (credentials.username === "test" && credentials.password === "test") {
        dispatch(setCurrentUser({
          id: "1",
          username: "test",
          email: "test@example.com"
        }));
        navigate("/Profile");
      } else {
        setError("Invalid credentials. Try username: test, password: test");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <Navbar />
      <Starfield />
      <MatrixBackground />
      <CircuitBackground />

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-400">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSignin} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Username"
                className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                  text-white placeholder:text-gray-500 focus:border-blue-500 
                  transition-colors duration-300"
              />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                  text-white placeholder:text-gray-500 focus:border-blue-500 
                  transition-colors duration-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 
                text-white font-medium transition-colors duration-300"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
