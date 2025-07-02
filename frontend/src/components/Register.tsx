import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const lime = {
  main: "#A3E635",
  light: "#D9F99D",
  gradientFrom: "#F7FFE5",
  gradientTo: "#D9F99D",
};

const animationConfig = {
  duration: 0.8,
  ease: "easeOut" as const,
  staggerDelay: 0.1,
};
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      staggerChildren: animationConfig.staggerDelay,
      delayChildren: 0.1,
    },
  },
};

const elementVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    },
  },
};

const iconVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: animationConfig.duration * 1.2,
      ease: animationConfig.ease,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const buttonVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: `0 2px 8px ${lime.light}`,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: `0 6px 20px ${lime.light}`,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const errorVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await register(formData.email, formData.password);
      navigate("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (): string => {
    const baseClasses =
      "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50";
    const errorClasses = error
      ? "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100 hover:shadow-red-200/50"
      : "";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={elementVariants}>
          <motion.div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${lime.main} 0%, ${lime.light} 100%)`,
              boxShadow: `0 8px 32px ${lime.light}`,
            }}
            variants={iconVariants}
          >
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8zm6 2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2"
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border-2"
          style={{
            boxShadow: `0 20px 60px 0 rgba(163, 230, 53, 0.2)`,
            borderColor: lime.light,
          }}
          variants={elementVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={elementVariants}>
              <motion.label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </motion.label>
              <motion.input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={getInputClassName()}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                whileHover={{
                  scale: 1.01,
                  boxShadow: `0 4px 12px ${lime.light}40`,
                }}
                whileFocus={{
                  scale: 1.02,
                  boxShadow: `0 0 0 3px ${lime.light}, 0 8px 20px ${lime.light}30`,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>

            <motion.div variants={elementVariants} className="relative">
              <motion.label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </motion.label>
              <motion.input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={getInputClassName() + " pr-10"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                whileHover={{
                  scale: 1.01,
                  boxShadow: `0 4px 12px ${lime.light}40`,
                }}
                whileFocus={{
                  scale: 1.02,
                  boxShadow: `0 0 0 3px ${lime.light}, 0 8px 20px ${lime.light}30`,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[70%] -translate-y-1/2 p-0 m-0 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none hover:border-none text-gray-400 hover:text-lime-500 transition-colors duration-200 flex items-center justify-center"
                style={{
                  boxShadow: "none",
                  background: "none",
                  outline: "none",
                  border: "none",
                }}
                whileTap={{ scale: 0.92, rotate: 8 }}
                whileHover={{ scale: 1.12, rotate: showPassword ? 0 : 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </motion.div>

            <motion.div variants={elementVariants} className="relative">
              <motion.label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </motion.label>
              <motion.input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={getInputClassName() + " pr-10"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                whileHover={{
                  scale: 1.01,
                  boxShadow: `0 4px 12px ${lime.light}40`,
                }}
                whileFocus={{
                  scale: 1.02,
                  boxShadow: `0 0 0 3px ${lime.light}, 0 8px 20px ${lime.light}30`,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.button
                type="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-[70%] -translate-y-1/2 p-0 m-0 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none hover:border-none text-gray-400 hover:text-lime-500 transition-colors duration-200 flex items-center justify-center"
                style={{
                  boxShadow: "none",
                  background: "none",
                  outline: "none",
                  border: "none",
                }}
                whileTap={{ scale: 0.92, rotate: 8 }}
                whileHover={{
                  scale: 1.12,
                  rotate: showConfirmPassword ? 0 : 8,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${lime.main} 0%, ${lime.light} 100%)`,
                boxShadow: `0 4px 16px ${lime.light}`,
              }}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              animate="rest"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </motion.button>
          </form>

          <motion.div className="mt-8" variants={elementVariants}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div className="mt-6 text-center" variants={elementVariants}>
            <Link
              to="/login"
              className="font-semibold text-sm transition-all duration-200 hover:scale-105 inline-block"
              style={{
                color: lime.main,
              }}
            >
              Sign in to your existing account
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
