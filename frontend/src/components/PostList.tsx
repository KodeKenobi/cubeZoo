import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { postsAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine } from "lucide-react";

const lime = {
  main: "#A3E635",
  light: "#D9F99D",
  gradientFrom: "#F7FFE5",
  gradientTo: "#D9F99D",
};

interface Post {
  id: string;
  title: string;
  content: string;
  publication_date: string;
  owner_id: string;
  author_email: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (err: unknown) {
      setError("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await postsAPI.delete(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      alert("Failed to delete post");
    }
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-thin text-gray-900">Blog Posts</h1>
        {user && (
          <motion.div
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
            <Link
              to="/create-post"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${lime.main}, ${lime.light})`,
                color: "#fff",
                boxShadow: `0 4px 15px ${lime.light}60`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${lime.light}, ${lime.main})`,
                  boxShadow: `0 8px 25px ${lime.light}80`,
                }}
              />

              <PenLine
                size={18}
                className="relative z-10 group-hover:rotate-12 transition-transform duration-300 text-gray-900 font-thin"
              />
              <span className="relative z-10 text-gray-900 font-thin">
                Create New Post
              </span>
            </Link>
          </motion.div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No posts yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <AnimatePresence>
            {posts.map((post, idx) => {
              const isTruncated = post.content.length > 200;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200 shadow-2xl rounded-3xl p-0 group overflow-hidden text-left"
                  style={{ boxShadow: "0 4px 24px #64748b33" }}
                >
                  <motion.div
                    className="bg-slate-100/90 px-8 py-4 rounded-t-3xl flex items-center gap-3 justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 + 0.15, duration: 0.4 }}
                  >
                    <motion.h2
                      className="text-2xl font-extrabold text-gray-900 tracking-tight flex-1 text-left"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 + 0.22, duration: 0.3 }}
                    >
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </motion.h2>
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg ml-4">
                      {post.author_email[0].toUpperCase()}
                    </div>
                  </motion.div>
                  <motion.div
                    className="px-8 py-6 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 + 0.28, duration: 0.3 }}
                  >
                    <p
                      className={`text-gray-700 text-base leading-relaxed mb-3 relative ${
                        isTruncated ? "line-clamp-4" : ""
                      }`}
                      style={
                        isTruncated
                          ? {
                              WebkitMaskImage:
                                "linear-gradient(180deg, #000 60%, transparent 100%)",
                            }
                          : {}
                      }
                    >
                      {isTruncated
                        ? `${post.content.substring(0, 200)}...`
                        : post.content}
                    </p>
                    {isTruncated && (
                      <Link
                        to={`/post/${post.id}`}
                        className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-all duration-200 block text-left mt-1 group/readmore"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="inline-flex items-center gap-1 group-hover/readmore:translate-x-1 group-hover/readmore:text-blue-600 transition-all duration-200">
                          Read More ...
                        </span>
                      </Link>
                    )}
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white/70 rounded-b-3xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 + 0.34, duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500 text-left">
                      <span className="font-semibold text-slate-700">
                        {post.author_email}
                      </span>
                      <span className="mx-1">•</span>
                      <span>
                        {new Date(post.publication_date).toLocaleDateString()}
                      </span>
                    </div>
                    {user && user.id === post.owner_id && (
                      <div className="flex gap-2 ml-4">
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-all duration-200 group/edit text-sm font-medium px-0 py-0 bg-transparent border-none shadow-none"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 group-hover/edit:scale-110 group-hover/edit:-rotate-6 group-hover/edit:text-blue-600 transition-transform duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6"
                            />
                          </svg>
                          <span>Edit</span>
                        </Link>
                        <span
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-all duration-200 group/delete px-0 py-0 bg-transparent border-none shadow-none text-sm font-medium cursor-pointer"
                          title="Delete"
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleDelete(post.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 group-hover/delete:scale-110 group-hover/delete:rotate-6 group-hover/delete:text-red-600 transition-transform duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Delete</span>
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PostList;
