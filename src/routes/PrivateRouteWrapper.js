// PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRouteWrapper = () => {  
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return <Outlet />;
    }    
    return <Navigate replace to="/login" />;   
};

export default PrivateRouteWrapper;
