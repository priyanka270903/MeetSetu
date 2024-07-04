import { base_url_socket, header } from "../utils/constant";
import {
  APIMiddleware,
  successAlert,
  errorAlert,
} from "../helpers/GlobalFunctions";
import axios from "axios";
import Swal from "sweetalert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useLogin = ({
  setEmailVerified,
  setQrSvg,
  setSecret,
  handleOpenModal,
  SetAuthSocket,
  setAuthLogs,
  setEnterOTP,
  AUTHotp,
}) => {
  const navigate = useNavigate();
  const axiosInstance = axios.create();
  const [socket, SetSocket] = useState(false);
  const [accessToken,setAccessToken] = useState(null)

  useEffect(() => {
    if(accessToken){      
      console.log('Now here')
      console.log(accessToken)
      navigate('/')
    }
  },[accessToken])
  let endpoint = "/stakeholder/login/";
  let method = "post";
  let headers = header;
  useEffect(() => {
    if (AUTHotp.length == 6) {
      socket.send(
        JSON.stringify({
          otp: AUTHotp,
          action: "verify",
          client: "app",
          view: "login",
        })
      );
    }
  }, [AUTHotp]);
  const handleLogin = async (body) => {
    try {
      let response_obj = await APIMiddleware(
        axiosInstance,
        endpoint,
        method,
        headers,
        body,
        null
      );
      if (response_obj.error === false) {
        if (response_obj.response.status == 200) {
          const secretKey = response_obj?.response?.data?.data?.secret;
          const svgQR = response_obj?.response?.data?.data?.svg;

          setAuthLogs(response_obj?.response?.data?.data?.message);
          setSecret(secretKey);
          setEmailVerified(response_obj?.response?.data?.data?.email_verified);
          setQrSvg(svgQR);
          localStorage.setItem('user',response_obj?.response?.data?.data?.email)
          handleOpenModal();
          const socket = new WebSocket(`${base_url_socket}/auth/${secretKey}/`);
          SetSocket(socket);
          socket.onopen = async () => {
            socket.send(
              JSON.stringify({
                client: "app",
              })
            );
          };
          socket.onmessage = async (e) => {
            let data = JSON.parse(e.data);
            console.log(data)
            if (data.qr_scanned == true) {
              setEnterOTP(true);
            }
            if (data.data && data.data.verified && data.data.verified == true) {
              localStorage.setItem("accessToken", data.data.tokens.access);
              localStorage.setItem("refreshToken", data.data.tokens.refresh);              
              setAccessToken(localStorage.getItem('accessToken'))
            }
          };
          socket.onclose = async () => {
            console.log("Socket closed");
          };
          socket.onerror = async (e) => {
            console.log(e);
          };
        }
      } else {        
        if (response_obj.error.response) { 
          Swal({
            title: response_obj?.error?.response?.data?.message,
            text: "!!!!",
            icon: "error",
          });
        } else {
          Swal({
            title: response_obj.error.message,
            text: "!!!!",
            icon: "error",
            button: "OK",
          });
        }
        // console.log("Error in Login: ", response_obj.error);
      }
    } catch (error) {}
  };
  return {
    handleLogin,
  };
};

export default useLogin;
