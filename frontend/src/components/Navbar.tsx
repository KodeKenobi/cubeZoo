import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Compass,
  Info,
  LogIn,
  LogOut,
  UserPlus,
  PenLine,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  {
    name: "Home",
    to: "/",
    icon: <Home size={18} className="inline mb-0.5 mr-1" />,
  },
  {
    name: "Explore",
    to: "/explore",
    icon: <Compass size={18} className="inline mb-0.5 mr-1" />,
  },
  {
    name: "About",
    to: "/about",
    icon: <Info size={18} className="inline mb-0.5 mr-1" />,
  },
];

const lime = {
  main: "#A3E635",
  light: "#D9F99D",
  gradientFrom: "#F7FFE5",
  gradientTo: "#D9F99D",
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: `linear-gradient(90deg, ${lime.gradientFrom} 60%, ${lime.gradientTo} 100%)`,
        WebkitBackdropFilter: "blur(24px)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 8px 32px 0 rgba(163, 230, 53, 0.10)",
        borderBottom: `1.5px solid ${lime.light}`,
        borderRadius: "0 0 1.5rem 1.5rem",
      }}
    >
      <div className="w-full px-16">
        <div className="flex justify-between items-center h-20">
          <motion.div
            whileHover={{
              scale: 1.05,
              filter: "drop-shadow(0 4px 12px rgba(163, 230, 53, 0.3))",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            <Link
              to="/"
              className="text-3xl font-thin block"
              style={{
                color: "#222",
              }}
            >
              <span className="font-thin">Zoonotes</span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{
                    scale: 1.1,
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
                    to={link.to}
                    className="font-thin text-lg px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                    style={{
                      color: "#374151",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(217, 249, 157, 0.2)",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-lime-200/20 to-lime-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${lime.light}20, ${lime.main}20)`,
                      }}
                    />

                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>

                    <span
                      className="relative z-10 font-thin transition-all duration-300 group-hover:text-lime-700"
                      style={{ color: "#374151" }}
                    >
                      {link.name}
                    </span>

                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: `0 0 20px ${lime.light}40`,
                        background: `radial-gradient(circle at center, ${lime.light}20 0%, transparent 70%)`,
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <motion.span
                    className="text-gray-600 font-thin text-base mr-2 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Hi, {user.email}
                  </motion.span>

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
                        Create
                      </span>
                    </Link>
                  </motion.div>

                  {user.isAdmin && (
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
                        to="/admin/users"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          color: "#374151",
                          border: `2px solid ${lime.light}`,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${lime.light}30, ${lime.main}20)`,
                            boxShadow: `0 8px 25px ${lime.light}40`,
                          }}
                        />

                        <Shield
                          size={18}
                          className="relative z-10 group-hover:scale-110 transition-transform duration-300 font-thin"
                        />
                        <span className="relative z-10 font-thin">Admin</span>
                      </Link>
                    </motion.div>
                  )}

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
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group hover:from-red-600 hover:to-red-700"
                      style={{
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, #dc2626, #b91c1c)",
                          boxShadow: "0 8px 25px rgba(220, 38, 38, 0.4)",
                        }}
                      />

                      <LogOut
                        size={18}
                        className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300 font-thin"
                      />
                      <span className="relative z-10 font-thin">Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
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
                      to="/login"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: lime.main,
                        border: `2px solid ${lime.light}`,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${lime.light}30, ${lime.main}20)`,
                          boxShadow: `0 8px 25px ${lime.light}40`,
                        }}
                      />

                      <LogIn
                        size={18}
                        className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 font-thin text-gray-900"
                      />
                      <span className="relative z-10 font-thin text-gray-900">
                        Login
                      </span>
                    </Link>
                  </motion.div>

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
                      to="/register"
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

                      <UserPlus
                        size={18}
                        className="relative z-10 group-hover:scale-110 transition-transform duration-300 font-thin text-gray-900"
                      />
                      <span className="relative z-10 font-thin text-gray-900">
                        Register
                      </span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Hamburger for Mobile */}
            <motion.button
              className="md:hidden flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative overflow-hidden group"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              style={{
                color: lime.main,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${lime.light}30, ${lime.main}20)`,
                  boxShadow: `0 4px 15px ${lime.light}40`,
                }}
              />

              <div className="relative z-10">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed left-0 right-0 top-20 z-40 px-4"
            style={{
              background: `linear-gradient(90deg, ${lime.gradientFrom} 60%, ${lime.gradientTo} 100%)`,
              WebkitBackdropFilter: "blur(24px)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px 0 rgba(163, 230, 53, 0.10)",
              borderBottom: `1.5px solid ${lime.light}`,
              borderRadius: "0 0 1.5rem 1.5rem",
            }}
          >
            <div className="flex flex-col gap-3 py-6">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="font-thin text-lg px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                    style={{
                      color: lime.main,
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(217, 249, 157, 0.2)",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-lime-200/20 to-lime-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${lime.light}20, ${lime.main}20)`,
                      }}
                    />

                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>
                    <span className="relative z-10 font-thin group-hover:text-lime-700 transition-colors duration-300">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t my-3"
                style={{ borderColor: lime.light }}
              />

              {user ? (
                <>
                  <motion.span
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 font-thin text-base mb-3 px-4 py-2 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Hi, {user.email}
                  </motion.span>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/create-post"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${lime.main}, ${lime.light})`,
                        color: "#fff",
                        boxShadow: `0 4px 15px ${lime.light}60`,
                      }}
                      onClick={() => setMenuOpen(false)}
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
                        className="relative z-10 group-hover:rotate-12 transition-transform duration-300 font-thin"
                      />
                      <span className="relative z-10 font-thin">Create</span>
                    </Link>
                  </motion.div>

                  {user.isAdmin && (
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group mb-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          color: "#374151",
                          border: `2px solid ${lime.light}`,
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={() => setMenuOpen(false)}
                      >
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${lime.light}30, ${lime.main}20)`,
                            boxShadow: `0 8px 25px ${lime.light}40`,
                          }}
                        />
                        <Shield
                          size={18}
                          className="relative z-10 group-hover:scale-110 transition-transform duration-300 font-thin"
                        />
                        <span className="relative z-10 font-thin">Admin</span>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group hover:from-red-600 hover:to-red-700 w-full"
                      style={{
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, #dc2626, #b91c1c)",
                          boxShadow: "0 8px 25px rgba(220, 38, 38, 0.4)",
                        }}
                      />
                      <LogOut
                        size={18}
                        className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300 font-thin"
                      />
                      <span className="relative z-10 font-thin">Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group mb-3"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: lime.main,
                        border: `2px solid ${lime.light}`,
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${lime.light}30, ${lime.main}20)`,
                          boxShadow: `0 8px 25px ${lime.light}40`,
                        }}
                      />
                      <LogIn
                        size={18}
                        className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 font-thin"
                      />
                      <span className="relative z-10 font-thin">Login</span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-thin transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${lime.main}, ${lime.light})`,
                        color: "#fff",
                        boxShadow: `0 4px 15px ${lime.light}60`,
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${lime.light}, ${lime.main})`,
                          boxShadow: `0 8px 25px ${lime.light}80`,
                        }}
                      />
                      <UserPlus
                        size={18}
                        className="relative z-10 group-hover:scale-110 transition-transform duration-300 font-thin"
                      />
                      <span className="relative z-10 font-thin">Register</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
