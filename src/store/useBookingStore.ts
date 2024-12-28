import { create } from "zustand";

interface BookingState {
  fromLocation: any;
  toLocation: any;
  timeSlot: any;
  travelDate: any;
  selectedRoute: any;
  pricePerSeat: any;
  departureTime: any;
  arrivalTime: any;
  duration: any;
  seatsAvailable: any;
  busId: any;
  routeId: any;
  defaultTripId: any;
  selectedSeatNumber: any;
  fare: any;
  startTime: any;
  endTime: any;
  capacity: any;
  bookedSeats: any;
  addedResrvationId: any;
  setFare: (fare: any) => void;
  setAddedResrvationId: (addedResrvationId: any) => void;
  setFromLocation: (fromLocation: any) => void;
  setBookedSeats: (bookedSeats: any) => void;
  setBusId: (fromLocation: any) => void;
  setRouteId: (routeId: any) => void;
  setDefaultTripId: (defaultTripId: any) => void;
  setSelectedSeatNumber: (selectedSeatNumber: any) => void;
  setToLocation: (toLocation: any) => void;
  setTimeSlot: (timeSlot: any) => void;
  setStartTime: (startTime: any) => void;
  setEndTime: (endTime: any) => void;
  setCapacity: (capacity: any) => void;
  setDuration: (duration: any) => void;
  setTravelDate: (travelDate: any) => void;
}

export const useBookingStore = create<BookingState>((set: any) => ({
  fromLocation: "",
  toLocation: "",
  timeSlot: "",
  travelDate: "2024-12-22",
  selectedRoute: "",
  pricePerSeat: null,
  departureTime: "",
  arrivalTime: "",
  duration: "",
  seatsAvailable: null,
  busId: null,
  defaultTripId: null,
  selectedSeatNumber: null,
  fare: null,
  startTime: null,
  endTime: null,
  routeId: "",
  capacity: null,
  bookedSeats: null,
  addedResrvationId: null,
  setFare: (fare: any) => set({ fare }),
  setAddedResrvationId: (addedResrvationId: any) => set({ addedResrvationId }),
  setBookedSeats: (bookedSeats: any) => set({ bookedSeats }),
  setFromLocation: (fromLocation: any) => set({ fromLocation }),
  setBusId: (busId: any) => set({ busId }),
  setRouteId: (routeId: any) => set({ routeId }),
  setDefaultTripId: (defaultTripId: any) => set({ defaultTripId }),
  setCapacity: (capacity: any) => set({ capacity }),
  setSelectedSeatNumber: (selectedSeatNumber: any) =>
    set({ selectedSeatNumber }),
  setToLocation: (toLocation: any) => set({ toLocation }),
  setDuration: (duration: any) => set({ duration }),
  setTimeSlot: (timeSlot: any) => set({ timeSlot }),
  setStartTime: (startTime: any) => set({ startTime }),
  setEndTime: (endTime: any) => set({ endTime }),
  setTravelDate: (travelDate: any) => set({ travelDate }),
}));
