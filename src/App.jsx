import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/Layout";
import Home from "./pages/Home";
import Pg from "./pages/Pg";
import Rooms from "./pages/Rooms";
import Food from "./pages/Food";
import Contactus from "./pages/Contactus";
import Aboutus from "./pages/Aboutus";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PgDetails from "./pages/PgDetails";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditPg from "./pages/AdminEditPg";
import AdminViewPg from "./pages/AdminViewPg";
import AdminEditRoom from "./pages/AdminEditRoom";
import AdminViewRoom from "./pages/AdminViewRoom";
import AdminEditFood from "./pages/AdminEditFood";
import AdminViewFood from "./pages/AdminViewFood";
import FoodDetails from "./pages/FoodDetails";
import ErrorBoundary from "./common/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Pg", element: <Pg /> },
      { path: "/pg/:id", element: <PgDetails /> },
      { path: "/Rooms", element: <Rooms /> },
      { path: "/room/:id", element: <RoomDetails /> },
      { path: "/Food", element: <Food /> },
      { path: "/Contactus", element: <Contactus /> },
      { path: "/Aboutus", element: <Aboutus /> },
      { path: "/signin", element: <Signin /> },
      { path: "/signup", element: <Signup /> },
      { path: "/my-bookings", element: <MyBookings /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/pg/edit/:id", element: <AdminEditPg /> },
      { path: "/admin/pg/view/:id", element: <AdminViewPg /> },
      { path: "/admin/room/edit/:id", element: <AdminEditRoom /> },
      { path: "/admin/room/view/:id", element: <AdminViewRoom /> },
      { path: "/admin/food/edit/:id", element: <AdminEditFood /> },
      { path: "/admin/food/view/:id", element: <AdminViewFood /> },
      { path: "/food/:id", element: <FoodDetails /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
