import React, { useState, useEffect } from "react";
import buildings from "../assets/buildings.jpg";
import {
  fetchOperators,
  addOperator,
  updateOperator,
  deleteOperator,
} from "../Utils/Api";
import Button from "../Components/Button/Button";

const AddOperator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [operatorsData, setOperatorsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<any | null>(null);
  const [newOperator, setNewOperator] = useState<any>({
    name: "",
    contact: "",
    role: "operator",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      setLoading(true);
      const response = await fetchOperators("operator");
      setOperatorsData(response.users || []);
      setError(null);
    } catch (err) {
      console.error("Error loading operators:", err);
      setError("Failed to load operators. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isUpdateModalOpen && selectedOperator) {
      setSelectedOperator((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewOperator((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddOperator = async () => {
    const { name, role, email, password } = newOperator;

    if (!name || !role || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!["admin", "operator", "commuter"].includes(role)) {
      setError("Invalid role. Allowed roles are admin, operator, or commuter.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const response = await addOperator(newOperator);
      const addedOperator = response?.data || newOperator;
      setOperatorsData((prevOperators) => [...prevOperators, addedOperator]);
      setNewOperator({
        name: "",
        contact: "",
        role: "operator",
        email: "",
        password: "",
      });
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error adding operator:", err);
      setError("Failed to add operator. Please try again.");
    }
  };

  const handleUpdateClick = (operator: any) => {
    console.log("operator", operator);

    setSelectedOperator(operator);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateOperator = async () => {
    if (!selectedOperator) return;

    console.log("selectedOperator", selectedOperator);

    try {
      const response = await updateOperator(
        selectedOperator._id,
        selectedOperator
      );
      setOperatorsData((prevOperators) =>
        prevOperators.map((operator) =>
          operator._id === selectedOperator._id ? response : operator
        )
      );
      setIsUpdateModalOpen(false);
      setSelectedOperator(null);
      location.reload();
      setError(null);
    } catch (err) {
      console.error("Error updating operator:", err);
      setError("Failed to update operator. Please try again.");
    }
  };

  const handleDeleteOperator = async (operator: any) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      try {
        await deleteOperator(operator._id);
        setOperatorsData((prevOperators) =>
          prevOperators.filter((op) => op._id !== operator._id)
        );
        setError(null);
      } catch (err) {
        console.error("Error deleting operator:", err);
        setError("Failed to delete operator. Please try again.");
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
        <div className="flex justify-end mb-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <Button onClick={() => setIsModalOpen(true)}>Add Operator</Button>
        </div>

        <div className="rounded-lg border shadow-md bg-white">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading operators...
            </div>
          ) : operatorsData.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No operators available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {operatorsData.map((operator, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600">
                        {operator.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {operator.email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => handleUpdateClick(operator)}
                          variant="secondary"
                          className="mr-2"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => handleDeleteOperator(operator)}
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

      {/* Add Operator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Operator</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newOperator.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={newOperator.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                hidden
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newOperator.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newOperator.password}
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
                onClick={handleAddOperator}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Operator Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Update Operator</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={selectedOperator?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={selectedOperator?.role || "operator"}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                hidden
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={selectedOperator?.email || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOperator}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

export default AddOperator;
