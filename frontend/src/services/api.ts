import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const token = localStorage.getItem("token");

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: any };
      };
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      if (status === 401 && token) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(
          new Error("Your session has expired. Please log in again.")
        );
      }

      if (status === 401 && !token) {
        return Promise.reject(
          new Error("Please log in to access this resource.")
        );
      }

      if (status === 403) {
        return Promise.reject(
          new Error("You don't have permission to perform this action.")
        );
      }

      if (status === 404) {
        return Promise.reject(
          new Error("The requested resource was not found.")
        );
      }

      if (status === 500) {
        return Promise.reject(
          new Error("Server error. Please try again later.")
        );
      }

      if (data?.detail) {
        return Promise.reject(new Error(data.detail));
      }
    }

    return Promise.reject(
      new Error("An unexpected error occurred. Please try again.")
    );
  }
);

export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post("/users/", { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/token", { email, password });
    return response.data;
  },
};

export const postsAPI = {
  getAll: async () => {
    const response = await api.get("/posts/");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (title: string, content: string) => {
    const response = await api.post("/posts/", { title, content });
    return response.data;
  },

  update: async (id: string, title?: string, content?: string) => {
    const updateData: Record<string, string> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const response = await api.put(`/posts/${id}`, updateData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;
