import axios from "axios";

export interface Route {
  _id?: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  fare: number;
}

const axiosInstance = axios.create({
  baseURL: "https://sheet-booking-api.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API methods for routes
export const fetchRoutes = async () => {
  try {
    const response = await axiosInstance.get("/routes");
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
};

export const addRoute = async (routeData: Route) => {
  try {
    const response = await axiosInstance.post("/routes", routeData);
    return response.data;
  } catch (error) {
    console.error("Error adding route:", error);
    throw error;
  }
};

export const updateRoute = async (route: Route) => {
  try {
    if (!route._id) {
      throw new Error("Route ID is required for update");
    }
    const response = await axiosInstance.put(`/routes/${route._id}`, route);
    return response.data;
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};

export const deleteRoute = async (route: Route) => {
  try {
    if (!route._id) {
      throw new Error("Route ID is required for deletion");
    }
    const response = await axiosInstance.delete(`/routes/${route._id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};
export { axiosInstance };
