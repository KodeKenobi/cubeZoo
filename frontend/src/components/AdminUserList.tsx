import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Users, Shield, AlertTriangle } from "lucide-react";
import axios from "axios";

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

const tableRowVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface ApiUser {
  id: string;
  email: string;
  is_admin: boolean;
}

const AdminUserList: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await axios.get<ApiUser[]>("http://localhost:8000/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedUsers = res.data.map((u: ApiUser) => ({
          id: u.id,
          email: u.email,
          isAdmin: u.is_admin,
        }));
        setUsers(mappedUsers);
        setLoading(false);
      } catch (err: unknown) {
        setError("You are not authorized to view users or an error occurred.");
        setLoading(false);
      }
    };
    if (user?.isAdmin) fetchUsers();
    else setLoading(false);
  }, [token, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="w-full px-4 py-8">
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle size={24} />
          <span className="font-thin text-lg">
            Not authorized to access admin panel.
          </span>
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
              <Users size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-thin text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600 font-thin float-start">
                View and manage all registered users
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
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle size={20} />
              <span className="font-thin">{error}</span>
            </motion.div>
          )}

          <motion.div variants={elementVariants}>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 flex items-center gap-3">
              <Shield size={24} className="text-lime-600" />
              All Registered Users ({users.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <motion.tr
                    className="border-b-2"
                    style={{ borderColor: lime.light }}
                    variants={elementVariants}
                  >
                    <th className="text-left py-4 px-6 font-thin text-gray-700 text-lg">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 font-thin text-gray-700 text-lg">
                      Email
                    </th>
                  </motion.tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      className="border-b border-gray-100 hover:bg-lime-50/50 transition-colors duration-200"
                      custom={index}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <td className="py-4 px-6 font-thin text-gray-600 float-start">
                        {u.id}
                      </td>
                      <td className="py-4 px-6 font-thin text-gray-900 float-start">
                        {u.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-thin float-start ${
                            u.isAdmin
                              ? "bg-lime-100 text-lime-800 border border-lime-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {u.isAdmin ? (
                            <>
                              <Shield size={14} className="text-lime-600" />
                              Admin
                            </>
                          ) : (
                            "User"
                          )}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-500 text-lg font-thin">
                  No users found.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminUserList;
