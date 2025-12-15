import axios from "axios";

// Create an Axios instance with default configuration
 const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", // Your external API URL
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = ""

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient

// NOTE: We will add the request interceptor in a client component
// because we need access to the session from `next-auth/react`.
// This is a common pattern. We'll create a wrapper for this.