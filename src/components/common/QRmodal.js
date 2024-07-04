import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Card from "react-bootstrap/Card";
import OtpInput from "react-otp-input";

function QRModal(props) {
  const {
    emailVerified,
    open,
    onClose,
    qrSVG,
    enterOTP,
    AUTHotp,
    setOtp,
    logs,
  } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {emailVerified && enterOTP == false && qrSVG ? (
          <Card bg="light" style={{ width: "18rem" }} className="mb-2">
            {/* <Card.Header>2-Factor Authentication</Card.Header> */}
            <Card.Body className="bg-light text-center" id="qrcode-card">
              <Card.Title>Scan this QR code in the MeetGuardian APP</Card.Title>
              <Card.Text>
                <div
                  style={{ marginInline: "auto",width:"150px" }}
                  dangerouslySetInnerHTML={{ __html: qrSVG }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        ) : enterOTP == false ? (
          <Card bg="light" style={{ width: "18rem" }} className="mb-2">
            <Card.Header>2-Factor Authentication</Card.Header>
            <Card.Body className="bg-light text-center" id="qrcode-card">
              <Card.Title>
                Scan the QR code from the email in the MeetGuardian APP
              </Card.Title>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body className="text-center " id="otp-card">
              <Card.Title className="">
                Enter the TOTP
              </Card.Title>
              <OtpInput
                value={AUTHotp}
                onChange={setOtp}                
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                placeholder="000000"
                containerStyle="container"
                inputStyle="otpinputs"
                inputType="password"
              />
              <div className="container mt-4" id="authotplog">
                {JSON.stringify(logs)}
              </div>
            </Card.Body>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QRModal;
