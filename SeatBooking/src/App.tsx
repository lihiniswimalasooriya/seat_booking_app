import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Bookings from "./Bookings/Bookings";
import Home from "./Home/Home";
import AvailableBuses from "./AvailableBuses/AvailableBuses";
import SeatSelect from "./SeatSelect/SeatSelect";
import Payment from "./Payment/Payment";
import Bus from "./Bus/Bus";
import Routes from "./Routes/Routes";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      {
        path: "/availablebuses",
        element: <AvailableBuses />,
      },
      {
        path: "/seatselect",
        element: <SeatSelect pricePerSeat={0} />,
      },
      {
        path: "/payment",
        element: <Payment selectedSeats={[]} totalAmount={0} />,
      },
      {
        path: "/bus",
        element: <Bus />,
      },
      {
        path: "/routes",
        element: <Routes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
