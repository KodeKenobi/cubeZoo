import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUserList from "./components/AdminUserList";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isLoading } = useAuth();
  const location = useLocation();

  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  const renderRoutes = () => (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/post/:postId" element={<PostDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-post/:postId"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUserList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  return (
    <div className="min-h-screen">
      {!hideNav && <Navbar />}
      <main className={!hideNav ? "pt-20" : ""}>{renderRoutes()}</main>
    </div>
  );
};

export default App;
