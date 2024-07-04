import React, { useState } from "react";
import { APIMiddleware } from "../helpers/GlobalFunctions";
import axios from "axios";
import { base_url, base_url_socket, header } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert'

const useHome = () => {
  const axiosInstance = axios.create();
  let navigate = useNavigate();
  let headers = header;
  const [userList, setUserList] = useState([]);

  const GetActiveMeetings = async() => {
    const method = "get";
    const endpoint = "/meet/get_active_meetings";
    try {
      let response_obj = await APIMiddleware(
        axiosInstance,
        endpoint,
        method,
        headers,
        null,
        null
      );      
      if(response_obj.error == false){
        return response_obj.response.data.data
      }
    } catch (error) {
      console.log(error);
    }
  }
  const JoinMeeting =  async (meetUID) => {
    try {
      let body = {
        meet_uid: meetUID,        
      };
      let endpoint = "/meet/join_meet/";
      let method = "post";
      let response_obj = await APIMiddleware(
        axiosInstance,
        endpoint,
        method,
        headers,
        body,
        null
      );            
      if(response_obj.error == false){
        console.log(response_obj.response.data.data.UID, "response --------");
        const uid = response_obj.response.data.data.UID;
        navigate(`/meet/${uid}`);
      }else{
        Swal({
          title: response_obj.error.response.data.message,
          text: "!!!!",
          icon: "error",
          button: "OK",
        });        
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  const handleCreateNewMeeting = async ({
    activeSlide,
    selectedUsers = null,
  }) => {
    let body;
    console.log(activeSlide);
    if (activeSlide.type === "public" || activeSlide.type === "asktojoin") {
      body = {
        meet_type: activeSlide.type,
      };
    }
    if (activeSlide.type === "private" || activeSlide.type === "onetoone") {
      body = {
        meet_type: activeSlide.type,
        user_list: selectedUsers,
      };
    }

    let endpoint = "/meet/create_meet/";
    let method = "post";

    try {
      let response_obj = await APIMiddleware(
        axiosInstance,
        endpoint,
        method,
        headers,
        body,
        null
      );
      console.log(response_obj.response.data.data.UID, "response --------");
      const uid = response_obj.response.data.data.UID;
      navigate(`/meet/${uid}`);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getUserForPrivateMeeting = async () => {
    const method = "get";
    const endpoint = "/meet/get_user_list";
    try {
      let response_obj = await APIMiddleware(
        axiosInstance,
        endpoint,
        method,
        headers,
        null,
        null
      );
      setUserList(response_obj.response.data.data);
      console.log(response_obj.response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCreateNewMeeting,
    getUserForPrivateMeeting,
    JoinMeeting,
    GetActiveMeetings,
    userList,
  };
};

export default useHome;
