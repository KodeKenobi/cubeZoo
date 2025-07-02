import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import { motion } from "framer-motion";
import { PenLine, ArrowLeft, Save } from "lucide-react";

const lime = {
  main: "#A3E635",
  light: "#D9F99D",
  gradientFrom: "#F7FFE5",
  gradientTo: "#D9F99D",
};
const containerVariants = {
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
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const elementVariants = {
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
      duration: 0.8,
    },
  },
};

const buttonVariants = {
  rest: {
    scale: 1,
    boxShadow: `0 2px 8px ${lime.light}`,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: `0 6px 20px ${lime.light}`,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const errorVariants = {
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
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await postsAPI.create(title, content);
      navigate("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create post";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (): string => {
    return "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50";
  };

  const getTextareaClassName = (): string => {
    return "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50 resize-none";
  };

  return (
    <div className="w-full px-4 py-4">
      <motion.div
        className="mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={elementVariants}>
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(217, 249, 157, 0.2)",
                color: "#374151",
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Back to Posts</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              className="h-12 w-12 rounded-full flex items-center justify-center shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${lime.main} 0%, ${lime.light} 100%)`,
                boxShadow: `0 8px 32px ${lime.light}`,
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <PenLine size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-thin text-gray-900 mb-2">
                Create New Post
              </h1>
              <p className="text-gray-600 font-thin">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border-2"
          style={{
            boxShadow: `0 20px 60px 0 rgba(163, 230, 53, 0.2)`,
            borderColor: lime.light,
          }}
          variants={elementVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4"
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
                    <p className="text-sm text-red-700 font-thin">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={elementVariants}>
              <motion.label
                htmlFor="title"
                className="block text-lg float-start font-thin text-gray-700 mb-3"
              >
                Post Title
              </motion.label>
              <motion.input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={getInputClassName()}
                placeholder="Enter a compelling title for your post..."
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

            <motion.div variants={elementVariants}>
              <motion.label
                htmlFor="content"
                className="block text-lg float-start font-thin text-gray-700 mb-3"
              >
                Post Content
              </motion.label>
              <motion.textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className={getTextareaClassName()}
                placeholder="Write your post content here... Share your thoughts, ideas, or stories with the community."
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

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={elementVariants}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-8 border border-transparent rounded-xl shadow-lg text-lg font-thin text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Creating Post...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Post
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(217, 249, 157, 0.2)",
                  color: "#374151",
                }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <span>Cancel</span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          className="text-center text-sm text-gray-500 mt-8"
          variants={elementVariants}
        >
          <p className="font-thin">
            Your post will be visible to all community members
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreatePost;
