import axios from "axios";
import React, { useEffect } from "react";
import { header } from "../utils/constant";
import { APIMiddleware } from "../helpers/GlobalFunctions";
import { useParams } from "react-router-dom";
import Swal from "sweetalert";

const useMeetInfo = (props) => {
  const {
    meetDetails,
    setMeetDetails
  } = props
  
  const axiosInstance = axios.create();
  const { id } = useParams();  

  useEffect(() => {
    fetchMeetingData(id);
  }, []);

  const fetchMeetingData = async (uid) => {
    const endpoint = "/meet/get_meeting_details";
    const method = "get";
    let headers = header;
    let params = {
      meet_uid: uid,
    };
    let response_obj = await APIMiddleware(
      axiosInstance,
      endpoint,
      method,
      headers,
      null,
      params
    );    
    if(response_obj.error === false){
      if(response_obj.response.status == 200){
        if (response_obj.response.data){
          setMeetDetails(response_obj.response.data.data)
        }
      }
    }else{
      Swal({
        title: response_obj.error.message,
        text: "!!!!",
        icon: "error",
        button: "OK",
      });
    }
  };

  return { id };
};

export default useMeetInfo;
