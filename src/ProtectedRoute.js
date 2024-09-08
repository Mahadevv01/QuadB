import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { FetchedContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(FetchedContext);
  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
