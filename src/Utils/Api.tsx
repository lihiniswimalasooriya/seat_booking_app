import axios from "axios";

export interface Route {
  _id?: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  fare: number;
}

export interface Bus {
  _id?: string;
  busNumber: string;
  operator: string;
  route: string;
  capacity: number;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || "https://sheet-booking-api.vercel.app",
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

// API methods for buses
export const fetchBuses = async () => {
  try {
    const response = await axiosInstance.get("/buses");
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};

export const addBus = async (busData: Bus) => {
  try {
    const response = await axiosInstance.post("/buses", busData);
    return response.data;
  } catch (error) {
    console.error("Error adding bus:", error);
    throw error;
  }
};

export const updateBus = async (bus: Bus) => {
  try {
    if (!bus._id) {
      throw new Error("Bus ID is required for update");
    }
    const response = await axiosInstance.put(`/buses/${bus._id}`, bus);
    return response.data;
  } catch (error) {
    console.error("Error updating bus:", error);
    throw error;
  }
};

export const deleteBus = async (bus: Bus) => {
  try {
    if (!bus._id) {
      throw new Error("Bus ID is required for deletion");
    }
    const response = await axiosInstance.delete(`/buses/${bus._id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bus:", error);
    throw error;
  }
};


export const addOperator = async (operator: any) => {
  try {
    const response = await axiosInstance.post(`/auth/register`, operator);
    return response.data;
  } catch (error) {
    console.error("Error deleting bus:", error);
    throw error;
  }
};

export const fetchOperators = async (role:any) => {
  try {
    const response = await axiosInstance.get(`/auth/users?role=${role}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};

export const fetchAllBooking = async () => {
  try {
    const response = await axiosInstance.get(`/reservations`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};

export const updateOperator = async (id: string, operator: any) => {
  try {
    const response = await axiosInstance.put(`/auth/users/${id}`, operator);
    return response.data;
  } catch (error) {
    console.error("Error updating operator:", error);
    throw error;
  }
};

export const deleteOperator = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/auth/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting operator:", error);
    throw error;
  }
};


export { axiosInstance };
