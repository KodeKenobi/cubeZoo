import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postsAPI } from "../services/api";
import { motion } from "framer-motion";
import { Edit, ArrowLeft, Save } from "lucide-react";

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

const EditPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const post = await postsAPI.getById(postId!);
      setTitle(post.title);
      setContent(post.content);
    } catch (err: unknown) {
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await postsAPI.update(postId!, title, content);
      navigate(`/post/${postId}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update post";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getInputClassName = (): string => {
    return "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50";
  };

  const getTextareaClassName = (): string => {
    return "w-full px-4 py-3 border border-lime-300 bg-lime-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-gray-900 font-thin hover:border-lime-400 hover:bg-lime-100 hover:shadow-lg hover:shadow-lime-200/50 resize-none";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
        >
          {error}
        </motion.div>
      </div>
    );
  }

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
              onClick={() => navigate(`/post/${postId}`)}
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
              <span>Back to Post</span>
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
              <Edit size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-thin text-gray-900 mb-2">
                Edit Post
              </h1>
              <p className="text-gray-600 font-thin">
                Update your post content and title
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border-2"
          style={{
            borderColor: lime.light,
            boxShadow: `0 20px 40px ${lime.light}20`,
          }}
          variants={elementVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={elementVariants}>
              <label
                htmlFor="title"
                className="block text-sm font-thin text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={getInputClassName()}
                placeholder="Enter post title"
              />
            </motion.div>

            <motion.div variants={elementVariants}>
              <label
                htmlFor="content"
                className="block text-sm font-thin text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className={getTextareaClassName()}
                placeholder="Write your post content here..."
              />
            </motion.div>

            <motion.div className="flex gap-4 pt-4" variants={elementVariants}>
              <motion.button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${lime.main}, ${lime.light})`,
                  color: "#fff",
                  boxShadow: `0 4px 15px ${lime.light}60`,
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${lime.light}, ${lime.main})`,
                    boxShadow: `0 8px 25px ${lime.light}80`,
                  }}
                />

                <Save
                  size={18}
                  className="relative z-10 group-hover:rotate-12 transition-transform duration-300 text-gray-900 font-thin"
                />
                <span className="relative z-10 text-gray-900 font-thin">
                  {isSaving ? "Saving..." : "Save Changes"}
                </span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate(`/post/${postId}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
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
                <span>Cancel</span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditPost;
