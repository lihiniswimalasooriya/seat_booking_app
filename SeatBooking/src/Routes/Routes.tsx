import React, { useState } from "react";
import buildings from "../assets/buildings.jpg";
interface Route {
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  fare: number;
}

interface RoutesProps {
  routes?: Route[];
}

const Routes: React.FC<RoutesProps> = ({ routes = demoRoutes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routesData, setRoutesData] = useState<Route[]>(routes);
  const [newRoute, setNewRoute] = useState<Route>({
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    fare: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoute({
      ...newRoute,
      [name]: name === "fare" ? parseFloat(value) : value,
    });
  };

  const handleAddRoute = () => {
    if (
      newRoute.startPoint &&
      newRoute.endPoint &&
      newRoute.distance &&
      newRoute.estimatedTime &&
      newRoute.fare > 0
    ) {
      setRoutesData([...routesData, newRoute]);
      setNewRoute({
        startPoint: "",
        endPoint: "",
        distance: "",
        estimatedTime: "",
        fare: 0,
      });
      setIsModalOpen(false);
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
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Add Bus
          </button>
        </div>
        <div className="rounded-lg border shadow-md">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routesData.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-base">
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
                      ${route.fare.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
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
    </div>
  );
};

// Demo data for the table
const demoRoutes: Route[] = [
  {
    startPoint: "New York",
    endPoint: "Boston",
    distance: "215 miles",
    estimatedTime: "4 hours",
    fare: 150.0,
  },
  {
    startPoint: "Los Angeles",
    endPoint: "San Francisco",
    distance: "383 miles",
    estimatedTime: "6 hours",
    fare: 200.0,
  },
  {
    startPoint: "Chicago",
    endPoint: "Detroit",
    distance: "282 miles",
    estimatedTime: "4.5 hours",
    fare: 175.0,
  },
];

export default Routes;
