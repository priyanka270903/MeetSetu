import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import MeetView from "../pages/MeetView";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import PrivateRouteWrapper from "./PrivateRouteWrapper";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRouteWrapper />}>
        <Route path="/meet/:id" element={<MeetView />} />
        <Route path="/" element={<Homepage />} />
      </Route>
    </Routes>
  );
};

export default MainRouter;
