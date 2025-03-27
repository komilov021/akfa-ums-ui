import { useUsersStore } from "@/stores/user";
import axios from "axios";
import { ElMessage } from "element-plus";

const fileRequest = axios.create({
  baseURL: import.meta.env.VITE_FILE_API,
  timeout: 5000,
});

// Request interceptors
fileRequest.interceptors.request.use(
  (config) => {
    const store = useUsersStore();
    if (store.token) {
      config.headers["Authorization"] = `Bearer ${store.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptors
fileRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = JSON.parse(error.request.response);
    ElMessage({
      message: errorResponse.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default fileRequest;
