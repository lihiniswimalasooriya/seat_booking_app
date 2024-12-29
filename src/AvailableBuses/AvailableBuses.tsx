import { useEffect, useState } from "react";
import buildings from "../assets/buildings.jpg";
import Button from "../Components/Button/Button";
import SeatSelect from "../SeatSelect/SeatSelect";
import { useBookingStore } from "../store/useBookingStore";
import { axiosInstance } from "../Utils/Api";
import useWebSocket from "../Utils/useWebSocket";

const AvailableBuses = () => {
  const {
    selectedRoute,
    capacity,
    travelDate,
    toLocation,
    fromLocation,
    duration,
    setBookedSeats,
    busId,
    defaultTripId,
    fare,
    endTime,
    startTime,
    routeId,
  } = useBookingStore();
  const { finalMessage, status } = useWebSocket(
    "wss://sheetbookingsocket.glitch.me"
  );

  const [wsResponse, setwsResponse] = useState();

  useEffect(() => {
    try {
      // Parse the outer JSON
      if (finalMessage) {
        const outerObject = JSON.parse(finalMessage);

        // Parse the inner JSON string in the "message" key
        const innerObject = JSON.parse(outerObject.message);
        setwsResponse(innerObject);
        console.log("innerObject", innerObject);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [finalMessage]);
  
  useEffect(() => {
    try {
      // Parse the outer JSON
      if (finalMessage) {
        const outerObject = JSON.parse(finalMessage);

        // Parse the inner JSON string in the "message" key
        const innerObject = JSON.parse(outerObject.message);
        setwsResponse(innerObject);
        console.log("innerObject", innerObject);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [finalMessage]);


  const [showSeatSelector, setShowSeatSelector] = useState(false);
  console.log("toLocation", toLocation);
  console.log("fromLocation", fromLocation);
  console.log("busId", busId);
  console.log("defaultTripId", defaultTripId);
  console.log("duration", duration);
  console.log("fare", fare);

  const handleSeatSelect = async (selectedSeats: number[]) => {
    console.log("Selected seats:", selectedSeats);
  };

  interface TripDetails {
    bookedSeats: number[];
    _id?: string;
    date: string;
    busId: string;
    defaultTripId: string;
    routeId: string;
  }

  const [selectedTripDetails, setSelectedTripDetails] =
    useState<TripDetails | null>(null);

  useEffect(() => {
    if (!toLocation) {
      return;
    }

    const fetchSelectedRoute = async () => {
      try {
        const response = await axiosInstance.get(
          `/reservations/trip?busId=${busId}&defaultTripId=${defaultTripId}&date=${travelDate}&routeId=${routeId}`
        );
        setSelectedTripDetails(response.data.trip);
        setBookedSeats(response.data.trip.bookedSeats);
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
        <h1 className="text-white text-4xl font-bold mb-10">
          Online Seat Reservation
        </h1>

        <div className="w-full max-w-4xl bg-slate-900 p-6 sm:p-8 rounded-lg text-white shadow-2xl">
          <h3 className="text-base sm:text-lg mb-4">{selectedRoute}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 bg-slate-800 rounded-lg mb-4 text-sm sm:text-base divide-y sm:divide-y-0 sm:divide-x divide-slate-700">
            <div className="p-4">
              <div className="text-gray-400 mb-1">DEPARTS</div>
              <div>{startTime}</div>
            </div>
            <div className="p-4 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span>↔</span>
                <div>
                  <div className="text-gray-400 mb-1">DURATION</div>
                  <div>Approx {duration}</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-gray-400 mb-1">ARRIVES</div>
              <div>{endTime}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <div className="text-gray-400 text-sm sm:text-base">
                for as low as
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{fare} LKR</div>
              <div className="text-gray-400 text-sm">PER SEAT</div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <Button
                onClick={() => setShowSeatSelector(!showSeatSelector)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                {showSeatSelector ? "Hide Seat Selection" : "Book My Seats"}
              </Button>
              {showSeatSelector && (
                <div className="mt-8">
                  <SeatSelect
                    totalSeats={capacity}
                    bookedSeats={selectedTripDetails?.bookedSeats}
                    onSeatSelect={handleSeatSelect}
                    pricePerSeat={fare}
                  />
                </div>
              )}
              <div className="text-green-500 text-sm sm:text-base">
                {capacity - (selectedTripDetails?.bookedSeats?.length ?? 0)}{" "}
                Seats Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBuses;
