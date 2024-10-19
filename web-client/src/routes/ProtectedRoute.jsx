import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser(); // Check if user data is loaded

  // If the Clerk user data is not loaded yet, you can show a loading state or spinner
  if (!isLoaded) {
    return <div>Loading...</div>; // You can replace this with an actual loading component
  }

  // If the user is not signed in, redirect to the login page
  if (!isSignedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If the user is signed in, render the protected route
  return children;
};

export default ProtectedRoute;
