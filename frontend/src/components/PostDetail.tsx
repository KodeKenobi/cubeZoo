import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { postsAPI } from "../services/api";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  content: string;
  publication_date: string;
  owner_id: string;
  author_email: string;
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const data = await postsAPI.getById(postId!);
      setPost(data);
    } catch (err: unknown) {
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await postsAPI.delete(postId!);
      navigate("/");
    } catch (err: unknown) {
      alert("Failed to delete post");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Post not found"}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-6 text-left">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          ← Back to Posts
        </Link>
      </div>

      <article className="w-full bg-white/90 shadow-2xl rounded-3xl p-10 border border-slate-100">
        <header className="mb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-thin text-gray-900 mb-6 leading-tight text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center text-base text-gray-500 gap-2">
              <span className="font-semibold text-slate-700">
                By {post.author_email}
              </span>
              <span className="mx-1">•</span>
              <span>
                {new Date(post.publication_date).toLocaleDateString()}
              </span>
            </div>
            {user && user.id === post.owner_id && (
              <div className="flex gap-6">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-all duration-200 group/edit text-base font-medium px-0 py-0 bg-transparent border-none shadow-none"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover/edit:scale-110 group-hover/edit:-rotate-6 group-hover/edit:text-blue-600 transition-transform duration-200"
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
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-all duration-200 group/delete px-0 py-0 bg-transparent border-none shadow-none text-base font-medium cursor-pointer"
                  title="Delete"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleDelete();
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
        </header>
        <motion.div
          className="prose max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="whitespace-pre-wrap text-gray-800 text-lg leading-relaxed text-left">
            {post.content}
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default PostDetail;
