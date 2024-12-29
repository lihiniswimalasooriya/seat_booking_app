import React, { useEffect, useState } from "react";
import Button from "../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "../store/useBookingStore";
import { axiosInstance } from "../Utils/Api";
import useWebSocket from "../Utils/useWebSocket";

interface SeatSelectProps {
  totalSeats?: number;
  bookedSeats?: number[];
  onSeatSelect?: (selectedSeats: number[]) => void;
  pricePerSeat: number;
}

interface SeatProps {
  number: number;
  isBooked: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const Seat: React.FC<SeatProps> = ({
  number,
  isBooked,
  isSelected,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={isBooked || isSelected}
    className={`w-12 h-12 rounded-t-lg relative ${
      isBooked
        ? "bg-red-500 cursor-not-allowed"
        : isSelected
        ? "bg-green-500"
        : "bg-white hover:bg-gray-200"
    } transition-colors duration-200 disabled:opacity-100`}
  >
    <span
      className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium ${
        isBooked || isSelected ? "text-white" : "text-black"
      }`}
    >
      {number}
    </span>
  </button>
);

const Legend: React.FC = () => (
  <div className="flex justify-center items-center gap-8 mb-8">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-white rounded border border-gray-300"></div>
      <span className="text-sm">Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-red-500 rounded"></div>
      <span className="text-sm">Booked</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-green-500 rounded"></div>
      <span className="text-sm">Selected</span>
    </div>
  </div>
);

const SeatSelect: React.FC<SeatSelectProps> = ({
  totalSeats = 42,
  bookedSeats = [],
  pricePerSeat = 0,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const { setAddedResrvationId, travelDate, busId, defaultTripId, fare } =
    useBookingStore();

  const { finalMessage } = useWebSocket(
    import.meta.env.VITE_APP_BASE_URL
  );

  const [, setwsResponse] = useState<any>();

  useEffect(() => {
    try {
      // Parse the outer JSON
      if (finalMessage) {
        const outerObject = JSON.parse(finalMessage);

        // Parse the inner JSON string in the "message" key
        const innerObject = JSON.parse(outerObject.message);

        // Only update state if the bookedSeats are different from the current state
        if (
          JSON.stringify(innerObject.bookedSeats) !==
          JSON.stringify(selectedSeats)
        ) {
          setwsResponse(innerObject);
          setSelectedSeats(innerObject.bookedSeats);
        }
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [finalMessage]);

  const navigate = useNavigate();

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const [newSeat, setNewSeat] = useState<any>();
  

  const handleSeatClick = (seatNumber: number) => {
    
    if (bookedSeats.includes(seatNumber)) return;
    setNewSeat(seatNumber)
    setSelectedSeats((prev) => {
      const newSelection = prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber];

      // Sort the seats after selection
      return newSelection.sort((a, b) => a - b);
    });
  };

  const handleConfirmSelection = async () => {
    const isConfirmed = window.confirm(
      `You have selected seats: ${selectedSeats.join(
        ", "
      )}. Total Amount: ${totalAmount.toLocaleString()} LKR. Do you want to proceed?`
    );

    if (isConfirmed) {
      try {
        // Create reservation
        const body = {
          busId,
          defaultTripId,
          date: travelDate,
          seatNumber: newSeat, // Get the last seat
        };

        const responseReservation = await axiosInstance.post(
          "/reservations",
          body
        );
        setAddedResrvationId(responseReservation.data.reservation._id);

        if (responseReservation?.data?.reservation?._id) {
          setAddedResrvationId(responseReservation.data.reservation._id);
          navigate("/"); // Only navigate to the home page
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "An error occurred while processing your reservation. Please try again later."
        );
      }
    }
  };

  const totalAmount =
    pricePerSeat > 0 ? selectedSeats.length * pricePerSeat : 0;

  return (
    <div className="w-full bg-slate-900 p-6 rounded-lg text-white">
      <h3 className="text-xl font-semibold mb-6 text-center">
        Select Your Seat
      </h3>

      <Legend />

      <div className="w-full h-16 bg-slate-800 rounded-t-3xl mb-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-gray-400">Driver Seat</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {seats.map((seatNumber) => (
          <Seat
            key={seatNumber}
            number={seatNumber}
            isBooked={bookedSeats.includes(seatNumber)}
            isSelected={selectedSeats.includes(seatNumber)}
            onClick={() => handleSeatClick(seatNumber)}
          />
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-8 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold">
                Selected Seats: {newSeat}
              </p>
              <p className="text-sm text-gray-400">Total Amount: {fare} LKR</p>
            </div>
            <Button
              onClick={handleConfirmSelection}
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelect;
