# Blog Platform - Full-Stack Developer Practical Test

A multi-user blog platform built with Python FastAPI backend and React TypeScript frontend, featuring JWT authentication and role-based authorization.

## 🚀 Features

### Core Features

- **User Authentication**: JWT-based registration and login system
- **Blog Post Management**: Create, read, update, and delete blog posts
- **Authorization**: Users can only manage their own posts
- **Responsive UI**: Modern, clean interface built with Tailwind CSS
- **Protected Routes**: Client-side route protection for authenticated users

### Technical Features

- **FastAPI Backend**: RESTful API with automatic documentation
- **React Frontend**: Single-page application with TypeScript
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **Docker Support**: Containerized deployment with docker-compose

## 🛠️ Technology Stack

### Backend

- **Python 3.11** - Programming language
- **FastAPI** - Modern, fast web framework
- **Pydantic** - Data validation using Python type annotations
- **python-jose** - JWT token handling
- **passlib** - Password hashing with bcrypt
- **uvicorn** - ASGI server

### Frontend

- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Typed JavaScript
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
cube-zoo/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main application file
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Development server script
│   └── Dockerfile         # Backend container configuration
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main application component
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile         # Frontend container configuration
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **Python** (version 3.11 or higher)
- **Docker** and **Docker Compose** (for containerized deployment)

### Option 1: Local Development

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
python run.py
```

The backend will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5174`

### Option 2: Docker Deployment (Recommended)

```bash
# From the root directory
docker-compose up --build
```

This will start both services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users can create accounts with email and password
2. **Login**: Users receive a JWT token upon successful authentication
3. **Authorization**: The token is automatically included in API requests
4. **Security**: Passwords are hashed using bcrypt before storage

### JWT Storage

JWT tokens are stored in `localStorage` for persistence across browser sessions. In a production environment, consider using secure HTTP-only cookies for enhanced security.

## 📝 API Endpoints

### Authentication

- `POST /users/` - Register a new user
- `POST /token` - Login and receive JWT token

### Blog Posts

- `GET /posts/` - Get all posts (public)
- `GET /posts/{id}` - Get specific post (public)
- `POST /posts/` - Create new post (authenticated)
- `PUT /posts/{id}` - Update post (owner only)
- `DELETE /posts/{id}` - Delete post (owner only)

## 🎨 UI Features

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Clean, modern interface
- Loading states and error handling
- Form validation and user feedback

### User Experience

- Conditional rendering based on authentication state
- Protected routes with automatic redirects
- Intuitive navigation and user flow
- Clear error messages and success feedback

## 🔧 Development

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Pydantic for data validation

### Testing

A test script is provided to validate the main API flows:

```bash
cd backend
python test_api.py
```

This script covers registration, login, post CRUD, and ownership rules

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🚀 Deployment

### Production Considerations

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MySQL)
2. **Security**: Use environment variables for sensitive data
3. **HTTPS**: Enable SSL/TLS in production
4. **Monitoring**: Add logging and monitoring
5. **Caching**: Implement Redis for session storage
6. **Load Balancing**: Use nginx or similar for load balancing

### Docker Production

```bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- The open-source community for all the amazing tools

## 🌟 Bonus Features

- **Admin User List:** The first registered user is an admin and can view all users via the `/users/` endpoint and the admin panel in the frontend.
- **Robust UI:** Loading spinners, error messages, and smooth animations for a polished user experience.
- **Protected Routes:** Client-side route protection ensures only authenticated users can access certain pages.

For more details on the frontend, see [frontend/README.md](./frontend/README.md).
