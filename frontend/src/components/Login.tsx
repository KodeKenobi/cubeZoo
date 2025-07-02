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

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
  field?: "email" | "password" | "general";
}

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

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error?.field === name) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError({ message: "Email is required", field: "email" });
      return false;
    }

    if (!formData.password.trim()) {
      setError({ message: "Password is required", field: "password" });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError({
        message: "Please enter a valid email address",
        field: "email",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setError({ message: errorMessage, field: "general" });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string): string => {
    const baseClasses =
      "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50";

    const errorClasses =
      error?.field === fieldName
        ? "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100 hover:shadow-red-200/50"
        : "";

    return `${baseClasses} ${errorClasses}`;
  };

  const renderHeader = () => (
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
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </motion.div>
    </motion.div>
  );

  const renderError = () => {
    if (!error?.message) return null;

    return (
      <motion.div
        className="bg-red-50 border border-red-200 rounded-xl p-4 mb-2"
        variants={errorVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderEmailField = () => (
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
        className={getInputClassName("email")}
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

      {error?.field === "email" && (
        <motion.p
          className="mt-1 text-sm text-red-600"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error.message}
        </motion.p>
      )}
    </motion.div>
  );

  const renderPasswordField = () => (
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
        autoComplete="current-password"
        required
        className={getInputClassName("password") + " pr-10"}
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
  );

  const renderPasswordError = () => {
    if (error?.field !== "password") return null;

    return (
      <motion.p
        className="mt-1 text-sm text-red-600"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {error.message}
      </motion.p>
    );
  };

  const renderSubmitButton = () => (
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
          Signing in...
        </div>
      ) : (
        "Sign in"
      )}
    </motion.button>
  );

  const renderDivider = () => (
    <motion.div className="mt-8" variants={elementVariants}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            New to CubeZoo?
          </span>
        </div>
      </div>
    </motion.div>
  );

  const renderRegisterLink = () => (
    <motion.div className="mt-6 text-center" variants={elementVariants}>
      <Link
        to="/register"
        className="font-semibold text-lg transition-all duration-200 hover:scale-105 inline-block"
        style={{
          color: lime.main,
        }}
      >
        Create a new account
      </Link>
    </motion.div>
  );

  const renderFooter = () => (
    <motion.div
      className="text-center text-sm text-gray-500"
      variants={elementVariants}
    >
      <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
    </motion.div>
  );

  return (
    <div className="h-screen min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderHeader()}

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border-2"
          style={{
            boxShadow: `0 20px 60px 0 rgba(163, 230, 53, 0.2)`,
            borderColor: lime.light,
          }}
          variants={elementVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderError()}
            {renderEmailField()}
            {renderPasswordField()}
            {renderPasswordError()}
            {renderSubmitButton()}
          </form>

          {renderDivider()}
          {renderRegisterLink()}
        </motion.div>

        {renderFooter()}
      </motion.div>
    </div>
  );
};

export default Login;
