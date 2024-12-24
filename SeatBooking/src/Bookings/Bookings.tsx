import { useState } from "react";
import buildings from "../assets/buildings.jpg";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Button from "../Components/Button/Button";

const Bookings = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("2024-12-22");

  return (
    <div className="relative h-screen">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${buildings})`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />{" "}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
        <h1 className="text-white text-3xl font-bold mb-8">
          Online Seat Reservation
        </h1>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white/70 backdrop-blur-sm"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                >
                  <option value="">FROM</option>
                  <option value="location1">Location 1</option>
                  <option value="location2">Location 2</option>
                </select>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white/70 backdrop-blur-sm"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                >
                  <option value="">TO</option>
                  <option value="location1">Location 1</option>
                  <option value="location2">Location 2</option>
                </select>
              </div>
            </div>

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

            <a href="/availablebuses">
              <Button>SEARCH BUSES</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
