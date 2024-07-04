import React, { useState } from "react";
import Login from "../components/authentication/Login";
import QRModal from "../components/common/QRmodal";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrSVG, setQrSvg] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [secret, setSecret] = useState(false);
  const [enterOTP, setEnterOTP] = useState(false);
  const [AuthSocket, SetAuthSocket] = useState(false);
  const [AUTHotp, setOtp] = useState("");
  const [logs, setAuthLogs] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to={"/"} />;
  }
  return (
    <div>
      <Login
        setEmailVerified={setEmailVerified}
        setQrSvg={setQrSvg}
        setSecret={setSecret}
        handleOpenModal={handleOpenModal}
        SetAuthSocket={SetAuthSocket}
        setAuthLogs={setAuthLogs}
        setEnterOTP={setEnterOTP}
        AUTHotp={AUTHotp}
      />
      <QRModal
        emailVerified={emailVerified}
        open={isModalOpen}
        onClose={handleCloseModal}
        qrSVG={qrSVG}
        enterOTP={enterOTP}
        AUTHotp={AUTHotp}
        setOtp={setOtp}
        logs={logs}
      />
    </div>
  );
};

export default LoginPage;
