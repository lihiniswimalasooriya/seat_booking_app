import React, { useState, useEffect } from "react";
import buildings from "../assets/buildings.jpg";
import {
  Route,
  fetchRoutes,
  addRoute,
  updateRoute,
  deleteRoute,
} from "../Utils/Api";
import Button from "../Components/Button/Button";

const Routes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [routesData, setRoutesData] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [newRoute, setNewRoute] = useState<Route>({
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    fare: 0,
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetchRoutes();

      if (Array.isArray(response)) {
        setRoutesData(response);
      } else if (response && Array.isArray(response.data)) {
        setRoutesData(response.data);
      } else if (response && typeof response === "object") {
        const possibleRoutes = Object.values(response).find((value) =>
          Array.isArray(value)
        );
        if (possibleRoutes) {
          setRoutesData(possibleRoutes);
        } else {
          if (response.startPoint && response.endPoint) {
            setRoutesData([response]);
          } else {
            setRoutesData([]);
          }
        }
      } else {
        setRoutesData([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading routes:", err);
      setError("Failed to load routes. Please try again later.");
      setRoutesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "fare" ? parseFloat(value) : value;

    if (isUpdateModalOpen && selectedRoute) {
      setSelectedRoute({
        ...selectedRoute,
        [name]: updatedValue,
      });
    } else {
      setNewRoute({
        ...newRoute,
        [name]: updatedValue,
      });
    }
  };

  const handleAddRoute = async () => {
    if (
      newRoute.startPoint &&
      newRoute.endPoint &&
      newRoute.distance &&
      newRoute.estimatedTime &&
      newRoute.fare > 0
    ) {
      try {
        const response = await addRoute(newRoute);
        const addedRoute = response?.data || response || newRoute;
        setRoutesData((prevRoutes) => [...prevRoutes, addedRoute]);
        setNewRoute({
          startPoint: "",
          endPoint: "",
          distance: "",
          estimatedTime: "",
          fare: 0,
        });
        setIsModalOpen(false);
        setError(null);
        await loadRoutes();
      } catch (err) {
        console.error("Error adding route:", err);
        setError("Failed to add route. Please try again.");
      }
    }
  };

  const handleUpdateClick = (route: Route) => {
    setSelectedRoute(route);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateRoute = async () => {
    if (!selectedRoute) return;

    try {
      await updateRoute(selectedRoute);
      await loadRoutes();
      setIsUpdateModalOpen(false);
      setSelectedRoute(null);
      setError(null);
    } catch (err) {
      console.error("Error updating route:", err);
      setError("Failed to update route. Please try again.");
    }
  };

  const handleDeleteRoute = async (route: Route) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(route);
        await loadRoutes();
        setError(null);
      } catch (err) {
        console.error("Error deleting route:", err);
        setError("Failed to delete route. Please try again.");
      }
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
      <div className="relative z-10 w-full max-w-6xl p-8 pt-16">
        <div className="flex justify-between mb-4">
          <div>
            {/* {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )} */}
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add Route</Button>
        </div>

        <div className="rounded-lg border shadow-md bg-white">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading routes...
            </div>
          ) : routesData.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No routes available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider min-w-[180px]">
                      Start Point
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider min-w-[180px]">
                      End Point
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider min-w-[120px]">
                      Distance
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider min-w-[140px]">
                      Estimated Time
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-black uppercase tracking-wider min-w-[120px]">
                      Fare
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-black uppercase tracking-wider min-w-[160px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {routesData.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">
                        {route.startPoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">
                        {route.endPoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">
                        {route.distance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">
                        {route.estimatedTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 text-base">
                        Rs{route.fare.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          onClick={() => handleUpdateClick(route)}
                          variant="secondary"
                          className="mr-2"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => handleDeleteRoute(route)}
                          variant="delete"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Bus Route</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="startPoint"
                placeholder="Start Point"
                value={newRoute.startPoint}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="endPoint"
                placeholder="End Point"
                value={newRoute.endPoint}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="distance"
                placeholder="Distance"
                value={newRoute.distance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="estimatedTime"
                placeholder="Estimated Time"
                value={newRoute.estimatedTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare"
                value={newRoute.fare}
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
                onClick={handleAddRoute}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Route Modal */}
      {isUpdateModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Update Bus Route</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="startPoint"
                placeholder="Start Point"
                value={selectedRoute.startPoint}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="endPoint"
                placeholder="End Point"
                value={selectedRoute.endPoint}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="distance"
                placeholder="Distance"
                value={selectedRoute.distance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="estimatedTime"
                placeholder="Estimated Time"
                value={selectedRoute.estimatedTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare"
                value={selectedRoute.fare}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedRoute(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRoute}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
