// import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
// import Navbar from "./Navbar/Navbar";
// import Login from "./Pages/Login/Login";
// import Register from "./Pages/Register/Register";
// import Bookings from "./Bookings/Bookings";
// import Home from "./Home/Home";
// import AvailableBuses from "./AvailableBuses/AvailableBuses";
// import SeatSelect from "./SeatSelect/SeatSelect";
// import Payment from "./Payment/Payment";
// import Bus from "./Bus/Bus";
// import Routes from "./Routes/Routes";
// import AddOperator from "./AddOperator/AddOperator";

// const RootLayout = () => {
//   return (
//     <>
//       <Navbar />
//       <Outlet />
//     </>
//   );
// };

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/register",
//         element: <Register />,
//       },
//       {
//         path: "/bookings",
//         element: <Bookings />,
//       },
//       {
//         path: "/availablebuses",
//         element: <AvailableBuses />,
//       },
//       {
//         path: "/seatselect",
//         element: <SeatSelect pricePerSeat={0} />,
//       },
//       {
//         path: "/payment",
//         element: <Payment selectedSeats={[]} totalAmount={0} />,
//       },
//       {
//         path: "/bus",
//         element: <Bus />,
//       },
//       {
//         path: "/routes",
//         element: <Routes />,
//       },
//       {
//         path: "/addoperator",
//         element: <AddOperator />,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Bookings from "./Bookings/Bookings";
import Bus from "./Bus/Bus";
import AddOperator from "./AddOperator/AddOperator";
import ProtectedRoute from "./Utils/ProtectedRoute";
import Register from "./Pages/Register/Register";
import Home from "./Home/Home";
import AvailableBuses from "./AvailableBuses/AvailableBuses";
import SeatSelect from "./SeatSelect/SeatSelect";
import CustomRoutes from "./Routes/CustomRoutes";
import CommuterProfile from "./CommuterProfile/CommuterProfile";
import WebSocketTest from "./WebSocketTest";
import Trips from "./Trips/Trips";

function App() {
  // useEffect(() => {
  //   connectToWebSocket();
  //   const intervalId = setInterval(connectToWebSocket, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/SeatSelect"
          element={
            <ProtectedRoute allowedRoles={["commuter"]}>
              <SeatSelect pricePerSeat={0} />
            </ProtectedRoute>
          }
        />
        <Route path="/CustomRoutes" element={<CustomRoutes />} />

        {/* <Route path="/commuterprofile" element={<CommuterProfile />} /> */}
        <Route path="/websockettest" element={<WebSocketTest />} />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["commuter", "admin"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["commuter", "admin"]}>
              <Payment selectedSeats={[]} totalAmount={0} />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/AvailableBuses"
          element={
            <ProtectedRoute allowedRoles={["commuter", "admin"]}>
              <AvailableBuses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commuterprofile"
          element={
            <ProtectedRoute allowedRoles={["commuter"]}>
              <CommuterProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bus"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <Bus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CustomRoutes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addoperator"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddOperator />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
