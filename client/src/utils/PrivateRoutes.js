import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Functional component representing private routes accessible only when a user is authenticated
const PrivateRoutes = () => {
  // Retrieve user information from Redux state
  const user = useSelector((state) => state.user);

  // Conditional rendering: if user is authenticated, render the child components (Outlet), otherwise, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
