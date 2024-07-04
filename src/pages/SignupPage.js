import React from "react";
import Signup from "../components/authentication/Signup";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to={"/"} />;
  }
  return (
    <div>
      <Signup />
    </div>
  );
};

export default SignupPage;
