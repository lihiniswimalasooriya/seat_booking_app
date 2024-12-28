import { useEffect, useState } from "react";
import buildings from "../assets/buildings.jpg";
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react";
import Button from "../Components/Button/Button";
import { axiosInstance } from "../Utils/Api";
import { useBookingStore } from "../store/useBookingStore";
import { Link } from "react-router-dom";

interface Route {
  _id: string;
  startPoint: string;
  endPoint: string;
}

const Bookings = () => {
  const {
    fromLocation,
    toLocation,
    timeSlot,
    travelDate,
    setFromLocation,
    setToLocation,
    setTimeSlot,
    setDefaultTripId,
    setTravelDate,
    setBusId,
    setDuration,
    setStartTime,
    setEndTime,
    setFare,
    setCapacity,
    setRouteId,
  } = useBookingStore();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredEndPoints, setFilteredEndPoints] = useState<string[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<any[]>([]);
  const [defaultTrips, setDefaultTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axiosInstance.get("/routes");
        setRoutes(response.data.routes);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    if (!fromLocation) {
      setFilteredEndPoints([]);
      return;
    }

    const fetchEndLocations = async () => {
      try {
        const response = await axiosInstance.get(
          `/routes/filter?startPoint=${fromLocation}`
        );
        const endPoints = response.data.routes.map(
          (route: Route) => route.endPoint
        );
        setFilteredEndPoints(endPoints);
        setFilteredRoutes(response.data.routes);
      } catch (error) {
        console.error("Error fetching filtered end locations:", error);
      }
    };

    fetchEndLocations();
  }, [fromLocation]);

  useEffect(() => {
    if (!toLocation) {
      return;
    }

    const selectedRoute = filteredRoutes.find(
      (route: Route) => route.endPoint === toLocation
    );

    setRouteId(selectedRoute._id)
    const fetchSelectedRoute = async () => {
      try {
        const response = await axiosInstance.get(
          `/routes/${selectedRoute._id}`
        );
        setFare(response.data.route.fare)
        setDuration(response.data.route.estimatedTime);
        setDefaultTrips(response.data.defaultTrips);
      } catch (error) {
        console.error("Error fetching filtered end locations:", error);
      }
    };

    fetchSelectedRoute();
  }, [toLocation]);

  return (
    <div className="relative h-screen">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${buildings})`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
        <h1 className="text-white text-3xl font-bold mb-8">
          Online Seat Reservation
        </h1>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* FROM LOCATION */}
            <div className="flex-1">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white/70 backdrop-blur-sm"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                >
                  <option value="">FROM</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route.startPoint}>
                      {route.startPoint}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TO LOCATION */}
            <div className="flex-1">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white/70 backdrop-blur-sm"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                >
                  <option value="">TO</option>
                  {filteredEndPoints.map((endPoint, index) => (
                    <option key={index} value={endPoint}>
                      {endPoint}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TIME SLOT */}
            <div className="flex-1">
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white/70 backdrop-blur-sm"
                  value={timeSlot}
                  onChange={(e) => {
                    const selectedTrip = defaultTrips.find(
                      (trip) => trip._id === e.target.value
                    );
                    if (selectedTrip) {
                      console.log("Selected Trip:", selectedTrip);

                      setTimeSlot(selectedTrip.startTime);
                      setStartTime(selectedTrip.startTime);
                      setEndTime(selectedTrip.arrivalTime);
                      setBusId(selectedTrip.bus._id);
                      setCapacity(selectedTrip.bus.capacity);
                      setDefaultTripId(selectedTrip._id);
                    }
                  }}
                >
                  <option value="">Select Time</option>
                  {defaultTrips.map((trip) => (
                    <option key={trip._id} value={trip._id}>
                      {trip.startTime} - {trip.arrivalTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TRAVEL DATE */}
            <div className="flex-1">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>
            </div>

            <Link to="/availablebuses">
              <Button>SEARCH BUSES</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
