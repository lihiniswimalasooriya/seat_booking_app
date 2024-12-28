import React, { useState, useEffect } from "react";
import buildings from "../assets/buildings.jpg";
import Button from "../Components/Button/Button";
import { axiosInstance } from "../Utils/Api";

const Bus = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]); // Operators state
  const [routes, setRoutes] = useState<any[]>([]); // Routes state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBus, setNewBus] = useState<any>({
    busNumber: "",
    operator: "",
    route: "",
    capacity: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const response = await axiosInstance.get("/buses");
        if (Array.isArray(response.data.buses)) {
          setBuses(response.data.buses);
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error loading buses:", error);
      }
    };

    const loadOperators = async () => {
      try {
        const response = await axiosInstance.get("/auth/users?role=operator");
        if (Array.isArray(response.data.users)) {
          setOperators(response.data.users);
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error loading operators:", error);
      }
    };

    const loadRoutes = async () => {
      try {
        const response = await axiosInstance.get("/routes");
        if (Array.isArray(response.data.routes)) {
          setRoutes(response.data.routes);
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error loading routes:", error);
      }
    };

    loadBuses();
    loadOperators();
    loadRoutes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBus((prev: any) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const addOrUpdateBus = async () => {
    try {
      if (isEditing && editingBusId) {
        // Update bus
        await axiosInstance.put(`/buses/${editingBusId}`, newBus);
        // setBuses(updatedBuses);
        location.reload();
      } else {
        // Add new bus
         await axiosInstance.post("/buses", newBus);
        location.reload();
      }

      setNewBus({ busNumber: "", operator: "", route: "", capacity: 0 });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingBusId(null);
      console.log("buses buses", buses);
      
    } catch (error) {
      console.error("Error adding or updating bus:", error);
    }
  };

  const handleEdit = (bus: any) => {
    setNewBus(bus);
    setIsEditing(true);
    setEditingBusId(bus._id || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (busId: string) => {
    try {
      await axiosInstance.delete(`/buses/${busId}`);
      setBuses(buses.filter((bus) => bus._id !== busId));
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  return (
    <div
      className="relative flex justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${buildings})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="absolute top-4 right-20 z-20">
        <Button onClick={() => setIsModalOpen(true)}>Add Bus</Button>
      </div>
      <div className="relative z-10 w-full max-w-6xl p-8 pt-16">
        <div className="overflow-x-auto shadow-md rounded-lg mt-10">
          <table className="w-full text-sm text-left">
            <thead className="text-white bg-blue-600">
              <tr>
                <th className="px-6 py-3">Bus Number</th>
                <th className="px-6 py-3">Operator</th>
                <th className="px-6 py-3">Capacity</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{bus.busNumber}</td>
                  <td className="px-6 py-4">{bus.operator.name}</td>
                  <td className="px-6 py-4">{bus.capacity}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(bus)}
                    >
                      Update
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handleDelete(bus._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Update Bus" : "Add New Bus"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="busNumber"
                placeholder="Bus Number"
                value={newBus.busNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <select
                name="operator"
                value={newBus.operator}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Operator</option>
                {operators.map((operator) => (
                  <option key={operator._id} value={operator._id}>
                    {operator.name}
                  </option>
                ))}
              </select>
              <select
                name="route"
                value={newBus.route}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.startPoint} - {route.endPoint}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={newBus.capacity || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addOrUpdateBus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bus;
