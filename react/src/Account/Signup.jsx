import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "../Home/ThemeContext";
import Navbar from "../Navbar";
import Starfield from "../Home/Starfield";
import MatrixBackground from "../Home/MatrixBackground";
import CircuitBackground from "../Home/CircuitBackground";
import { FaCreditCard, FaLock, FaRocket } from 'react-icons/fa';

const steps = [
  {
    title: "Choose Your Plan",
    subtitle: "Select a plan that works for you"
  },
  {
    title: "Create Account",
    subtitle: "Enter your account details"
  },
  {
    title: "Almost Done",
    subtitle: "Just a few more details"
  },
  {
    title: "Payment Details",
    subtitle: "Secure payment processing"
  }
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "500 Executions/week",
      "Basic GPU access",
      "Community support"
    ]
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Unlimited Executions",
      "Priority GPU access",
      "24/7 Support"
    ]
  }
];

export default function Signup() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    plan: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handlePlanSelect = (planName) => {
    setFormData({ ...formData, plan: planName });
    setError("");
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.plan) {
          setError("Please select a plan to continue");
          return false;
        }
        break;
      case 1:
        if (!formData.username || !formData.email) {
          setError("Please fill in all fields");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email");
          return false;
        }
        break;
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          setError("Please fill in all fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
        break;
      case 3:
        if (formData.plan === "Enterprise") {
          if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
            setError("Please fill in all payment fields");
            return false;
          }
          if (formData.cardNumber.length !== 16) {
            setError("Invalid card number");
            return false;
          }
          if (formData.cvv.length !== 3) {
            setError("Invalid CVV");
            return false;
          }
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setError("");
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (formData.plan === "Enterprise") {
        dispatch({ type: 'PAYMENT_START' });
        const paymentResult = await dispatch({ 
          type: 'PROCESS_PAYMENT', 
          payload: {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          }
        });
        
        if (!paymentResult.success) {
          throw new Error("Payment failed");
        }
      }
      
      dispatch({ type: 'SIGNUP_START' });
      
      // Create account
      const signupResult = await dispatch({
        type: 'SIGNUP_USER',
        payload: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          plan: formData.plan
        }
      });

      if (signupResult.success) {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: signupResult.user });
        navigate("/dashboard");
      } else {
        throw new Error(signupResult.error || "Signup failed");
      }
    } catch (err) {
      dispatch({ type: 'SIGNUP_ERROR', payload: err.message });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                onClick={() => handlePlanSelect(plan.name)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300
                  ${formData.plan === plan.name ? 
                    'bg-blue-600 bg-opacity-20 border-blue-500' : 
                    'bg-[#0A1628] border-gray-700'
                  } border hover:border-blue-500`}
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div>
                    <span className="text-xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-400 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                text-white placeholder:text-gray-500 focus:border-blue-500 
                transition-colors duration-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                text-white placeholder:text-gray-500 focus:border-blue-500 
                transition-colors duration-300"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                text-white placeholder:text-gray-500 focus:border-blue-500 
                transition-colors duration-300"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                text-white placeholder:text-gray-500 focus:border-blue-500 
                transition-colors duration-300"
            />
          </div>
        );
      case 3:
        return formData.plan === "Enterprise" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <FaLock className="text-green-500" />
              <span>Secure Payment Processing</span>
              <FaCreditCard className="text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setFormData({ ...formData, cardNumber: value });
                }}
                className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                  text-white placeholder:text-gray-500 focus:border-blue-500 
                  transition-colors duration-300"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setFormData({ ...formData, expiryDate: value });
                  }}
                  className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                    text-white placeholder:text-gray-500 focus:border-blue-500 
                    transition-colors duration-300"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setFormData({ ...formData, cvv: value });
                  }}
                  className="w-full p-3 rounded-lg bg-[#0A1628] border border-gray-700 
                    text-white placeholder:text-gray-500 focus:border-blue-500 
                    transition-colors duration-300"
                />
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Your payment information is encrypted and secure
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <FaRocket className="text-4xl mx-auto mb-4 text-blue-500" />
            <p>No payment required for Free plan</p>
            <p className="text-sm mt-2">You can upgrade anytime</p>
          </div>
        );
    }
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
              {steps[currentStep].title}
            </h2>
            <p className="mt-2 text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {renderStepContent()}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 p-3 rounded-lg border border-gray-700 
                    text-white hover:border-gray-600 transition-colors duration-300"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 
                  text-white font-medium transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : 
                  currentStep === steps.length - 1 ? "Complete Signup" : "Next"}
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
