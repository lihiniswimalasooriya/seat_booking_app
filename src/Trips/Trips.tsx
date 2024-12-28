import React, { useState, useEffect } from "react";
import buildings from "../assets/buildings.jpg";
import Button from "../Components/Button/Button";
import { axiosInstance } from "../Utils/Api";

const Trips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState<any>({
    route: "",
    bus: "",
    startTime: "",
    arrivalTime: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await axiosInstance.get("/buses/defaultTrips");
        console.log("response", response);

        if (Array.isArray(response.data.trips)) {
          setTrips(response.data.trips);
        } else {
          console.error("Unexpected response format:", response.data);
          setTrips([]);
        }
      } catch (error) {
        console.error("Error loading trips:", error);
        setTrips([]);
      }
    };

    const loadBuses = async () => {
      try {
        const response = await axiosInstance.get("/buses");
        setBuses(response.data.buses || []);
      } catch (error) {
        console.error("Error loading buses:", error);
      }
    };

    const loadRoutes = async () => {
      try {
        const response = await axiosInstance.get("/routes");
        setRoutes(response.data.routes || []);
      } catch (error) {
        console.error("Error loading routes:", error);
      }
    };

    loadTrips();
    loadBuses();
    loadRoutes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTrip((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addOrUpdateTrip = async () => {
    try {
      if (isEditing && editingTripId) {
        await axiosInstance.put(`/trips/${editingTripId}`, newTrip);
        const updatedTrips = trips.map((trip) =>
          trip._id === editingTripId ? { ...trip, ...newTrip } : trip
        );
        setTrips(updatedTrips);
      } else {
        const response = await axiosInstance.post(
          "/buses/defaultTrips",
          newTrip
        );
        setTrips((prev) => [...prev, response.data]);
      }

      setNewTrip({ route: "", bus: "", startTime: "", arrivalTime: "" });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingTripId(null);
    } catch (error) {
      console.error("Error adding or updating trip:", error);
    }
  };

  const handleDelete = async (tripId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/buses/defaultTrips/${tripId}`);
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
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
        <Button onClick={() => setIsModalOpen(true)}>Add Trip</Button>
      </div>
      <div className="relative z-10 w-full max-w-6xl p-8 pt-16">
        <div className="overflow-x-auto shadow-md rounded-lg mt-10">
          <table className="w-full text-sm text-left">
            <thead className="text-white bg-blue-600">
              <tr>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Bus</th>
                <th className="px-6 py-3">Start Time</th>
                <th className="px-6 py-3">Arrival Time</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <tr
                    key={trip._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {trip.route?.startPoint || "Unknown"} -{" "}
                      {trip.route?.endPoint || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      {trip.bus?.busNumber || "Unknown"}
                    </td>
                    <td className="px-6 py-4">{trip.startTime || "N/A"}</td>
                    <td className="px-6 py-4">{trip.arrivalTime || "N/A"}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                        onClick={() => handleDelete(trip._id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={5}>
                    No trips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Update Trip" : "Add New Trip"}
            </h2>
            <div className="space-y-4">
              <select
                name="route"
                value={newTrip.route}
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
              <select
                name="bus"
                value={newTrip.bus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Bus</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.busNumber}
                  </option>
                ))}
              </select>
              <input
                type="time"
                name="startTime"
                value={newTrip.startTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="time"
                name="arrivalTime"
                value={newTrip.arrivalTime}
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
                onClick={addOrUpdateTrip}
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

export default Trips;
