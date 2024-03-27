import React from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "./stores/UserStore";

const Authorization = ({ children }) => {
  const { token } = userStore();
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Authorization;
