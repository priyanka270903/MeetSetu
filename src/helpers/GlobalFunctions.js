import axios from "axios";
// import base_url from "src/base_url";

import swal from "sweetalert";
import { base_url } from "../utils/constant";

// Used for handling expired tokens
const APIMiddleware = async (
  reqInstance,
  endpoint,
  method,
  headers,
  body = null,
  params = null
) => {
  // Get the access and refresh tokens
  const secret = localStorage.getItem("secret");
  const access = localStorage.getItem("accessToken");
  const refresh = localStorage.getItem("refreshToken");

  let data = body ? body : params;
  // Encrypt the data if secret key is there
  data = secret
    ? { secret: secret, data: await encrypt_xor(JSON.stringify(data), secret) }
    : { data: data };

  if(access && refresh){    
    headers["Authorization"] = `Bearer ${access}`;
  }

  console.log(data, "data------------------");
  let response_obj;
  window.setProgress(100);
  if (method === "get") {
    try {
      const response = await reqInstance.get(`${base_url}${endpoint}`, {
        headers,
        params: data,
      });
      response_obj = { error: false, response: response };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const result = await expireToken(refresh);
        localStorage.setItem("accessToken", result.access);
        localStorage.setItem("refreshToken", result.refresh);
        response_obj = await APIMiddleware(
          reqInstance,
          endpoint,
          method,
          headers,
          body,
          params
        );
      } else {
        response_obj = { error: true, error: error };
      }
    }
  } else if (method === "post") {
    try {
      const response = await reqInstance.post(`${base_url}${endpoint}`, data, {
        headers,
      });
      if (response.data.data.secret) {
        localStorage.setItem("secret", response.data.data.secret);
      }
      response_obj = { error: response.data.error, response: response };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const result = await expireToken(refresh);
        localStorage.setItem("accessToken", result.access);
        localStorage.setItem("refreshToken", result.refresh);
        response_obj = await APIMiddleware(
          reqInstance,
          endpoint,
          method,
          headers,
          body,
          params
        );
      } else {
        response_obj = { error: true, error: error };
      }
    }
  }
  return response_obj;
};

const expireToken = async (refreshToken) => {
  const header = {
    "ngrok-skip-browser-warning": true,
  };

  return axios
    .post(
      `${base_url}/auth/token/refresh/`,
      { refresh: refreshToken },
      { headers: header }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const encrypt_xor = async (plaintext, key) => {
  let textEncoder = new TextEncoder();

  let plaintextBytes = textEncoder.encode(plaintext);
  let keyBytes = textEncoder.encode(key);

  let ciphertextBytes = [];
  for (let i = 0; i < plaintextBytes.length; i++) {
    ciphertextBytes.push(plaintextBytes[i] ^ keyBytes[i % keyBytes.length]);
  }
  return btoa(String.fromCharCode(...ciphertextBytes));
};

export { APIMiddleware };
