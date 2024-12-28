import { useEffect, useState } from "react";
import { fetchAllBooking } from "../Utils/Api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserData } from "../Utils/Types";

const CommuterProfile = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userDataString) as UserData;
      setProfile(userData);
      setEditedName(userData.name);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleUpdateName = () => {
    if (!profile) return;

    const updatedProfile = { ...profile, name: editedName };
    localStorage.setItem("userData", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetchAllBooking();
      console.log("response", response.reservations);

      const userReservations = response.reservations.filter(
        (reservation: any) => reservation.commuter._id === userData.id
      );

      setMyBookings(userReservations);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl text-blue-600">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">Commuter Profile</h1>
                <p className="text-blue-100">View and manage your profile</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Full Name
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">{profile.name}</p>
                )}
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Address
                </h2>
                <p className="text-gray-700">{profile.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="text-gray-700">{profile.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">View My Bookings</h3>
              <p className="text-sm text-gray-500">
                Check your booking history
              </p>
            </button>
            <Link to={"/bookings"}>
              <button className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50">
                <h3 className="font-medium text-gray-900">New Booking</h3>
                <p className="text-sm text-gray-500">Book a new bus ticket</p>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for Booking Details */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white  !h-2/3 overflow-y-scroll rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Details
            </h2>
            <ul className="space-y-4">
              {myBookings?.map((booking: any) => (
                <li
                  key={booking._id}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <p className="font-medium text-gray-900">
                    Bus: {booking.bus.busNumber}
                  </p>
                  <p className="text-sm text-gray-700">
                    Seat No: {booking.seatNumber}
                  </p>
                  <p className="text-sm text-gray-700">
                    Payment Status:{" "}
                    <span className="font-medium">{booking.paymentStatus}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommuterProfile;
