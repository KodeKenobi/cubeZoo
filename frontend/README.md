# Cube Zoo - React Frontend

A modern, responsive React application for a blog platform with user authentication and post management.

## 🚀 Features

### Core Requirements ✅

#### 1. Authentication Flow

- **User Registration & Login**: Separate pages with form validation and error handling
- **JWT Token Management**: Automatic token storage in localStorage with session persistence
- **Centralized API Service**: Axios instance with automatic JWT attachment to all protected requests
- **Logout Functionality**: Clears token and redirects to login page
- **Protected Routes**: Route-level authentication with automatic redirects

#### 2. UI State & Conditional Rendering

- **Dynamic Navigation**: Navbar adapts based on authentication state
  - Logged out: Shows "Login" and "Register" links
  - Logged in: Shows "Create Post", "Admin" (if admin), and "Logout" links
- **User-Specific Elements**: Edit/Delete buttons only visible to post owners
- **Responsive Design**: Mobile-first approach with hamburger menu

#### 3. Blog Post Interaction

- **Public Post Listing**: Main page accessible to everyone, displays all posts with author emails
- **Protected Create Post**: Only logged-in users can create new posts
- **Ownership & Permissions**:
  - Edit/Delete buttons only visible to post authors
  - Server-side ownership validation enforced
  - Proper error handling for unauthorized actions

### Additional Features 🎨

#### Enhanced User Experience

- **Beautiful Animations**: Framer Motion animations throughout the app
- **Consistent Design System**: Lime color scheme with modern UI components
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works seamlessly on desktop and mobile

#### Admin Features

- **Admin Panel**: User management interface for administrators
- **User List**: View all registered users with admin status
- **Role-Based Access**: Admin-only routes and features

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx          # User login form
│   │   ├── Register.tsx       # User registration form
│   │   └── ProtectedRoute.tsx # Route protection wrapper
│   ├── Posts/
│   │   ├── PostList.tsx       # Main posts listing
│   │   ├── PostDetail.tsx     # Individual post view
│   │   ├── CreatePost.tsx     # Post creation form
│   │   └── EditPost.tsx       # Post editing form
│   ├── Admin/
│   │   └── AdminUserList.tsx  # User management interface
│   └── Layout/
│       └── Navbar.tsx         # Navigation component
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── services/
│   └── api.ts                 # Centralized API service
└── App.tsx                    # Main application component
```

### Key Technologies

- **React 19** with TypeScript
- **React Router v6** for client-side routing
- **Framer Motion** for animations
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔐 Authentication Implementation

### JWT Storage Strategy

We chose **localStorage** for JWT token storage for the following reasons:

**Pros:**

- **Session Persistence**: Tokens survive browser refreshes
- **Simplicity**: Easy to implement and debug
- **Cross-Tab Access**: Token available across browser tabs
- **No Server State**: Reduces server-side session management

**Security Considerations:**

- Tokens are automatically cleared on logout
- HTTP-only cookies would be more secure for production
- Consider implementing token refresh mechanism for production

### API Service Architecture

```typescript
// Automatic JWT attachment
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic auth error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Design System

### Color Palette

- **Primary**: Lime (`#A3E635`)
- **Secondary**: Light Lime (`#D9F99D`)
- **Background**: Gradient from `#F7FFE5` to `#D9F99D`
- **Text**: Gray scale (`#374151`, `#6B7280`, etc.)

### Typography

- **Font Weight**: Thin (`font-thin`) for modern, clean look
- **Font Sizes**: Responsive scale from `text-sm` to `text-5xl`
- **Line Heights**: Optimized for readability

### Animation System

- **Framer Motion**: Smooth, performant animations
- **Spring Physics**: Natural, responsive motion
- **Staggered Animations**: Sequential element reveals
- **Hover Effects**: Interactive feedback

## 🔒 Security Features

### Frontend Security

- **Protected Routes**: Automatic redirects for unauthenticated users
- **Input Validation**: Client-side form validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Backend handles CSRF tokens

### API Security

- **JWT Authentication**: Bearer token in Authorization header
- **Automatic Token Refresh**: Handled by backend
- **Error Handling**: Graceful degradation on auth failures

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (hamburger menu)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- **Touch-Friendly**: Large touch targets
- **Swipe Gestures**: Smooth navigation
- **Optimized Layout**: Stacked elements on small screens

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] User registration flow
- [ ] User login/logout
- [ ] Post creation (authenticated users only)
- [ ] Post editing (owners only)
- [ ] Post deletion (owners only)
- [ ] Admin panel access (admin users only)
- [ ] Responsive design on mobile/tablet
- [ ] Error handling and validation

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Performance Optimizations

### Code Splitting

- Route-based code splitting with React Router
- Lazy loading for non-critical components

### Bundle Optimization

- Tree shaking for unused code elimination
- Optimized imports for smaller bundle size

### Animation Performance

- Hardware-accelerated animations with Framer Motion
- Reduced motion support for accessibility

## 🔮 Future Enhancements

### Planned Features

- **Real-time Updates**: WebSocket integration for live post updates
- **Rich Text Editor**: Markdown support for post content
- **Image Upload**: File upload for post images
- **Search & Filter**: Advanced post search functionality
- **User Profiles**: Extended user profile pages
- **Comments System**: Post commenting functionality

### Technical Improvements

- **PWA Support**: Progressive Web App capabilities
- **Offline Support**: Service worker for offline functionality
- **Performance Monitoring**: Analytics and error tracking
- **A/B Testing**: Feature flag system

## 📄 License

This project is part of the Cube Zoo application suite.

---

**Note**: This frontend is designed to work with the FastAPI backend. Ensure the backend is running and properly configured before testing the frontend features.
