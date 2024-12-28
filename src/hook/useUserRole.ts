import { useState, useEffect } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  id: string;
}

const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData: UserData = JSON.parse(userDataString);
        setRole(userData.role || null);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Error reading user data from localStorage:", error);
      setRole(null);
    }
  }, []);

  return role;
};

export default useUserRole;
