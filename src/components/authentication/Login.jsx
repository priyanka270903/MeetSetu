import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../helpers/yupValidator";
import storysetillustration from "./Digital presentation-amico.svg";
import useLogin from "../../hooks/useLogin";
import { useAuth } from "../../context/AuthContext";
const Login = (props) => {
  const {
    setEmailVerified,
    setQrSvg,
    setSecret,
    handleOpenModal,
    SetAuthSocket,
    setAuthLogs,
    setEnterOTP,
    AUTHotp,
  } = props;
  const { register, handleSubmit } = useForm();
  const { handleLogin } = useLogin({
    setEmailVerified,
    setQrSvg,
    setSecret,
    handleOpenModal,
    SetAuthSocket,
    setAuthLogs,
    setEnterOTP,
    AUTHotp,
  });
  const handleFormSubmit = (data) => {
    handleLogin(data);
  };
  const context = useAuth();
  
  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="hidden lg:block w-full md:w-1/2 xl:w-1/2 h-screen">
        <img
          src={storysetillustration}
          alt=""
          width=""
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
  flex items-center justify-center"
      >
        <div className="w-full h-100">
          <h1 className="text-xl md:text-4xl font-bold leading-tight mt-12  ">
            Welcome Back
          </h1>

          <form
            className="mt-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                placeholder="Enter User Name"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none focus:placeholder-black text-black"
                {...register("email")}
              />
              {/* <ErrorMessage
                name="email"
                errors={errors}
                render={({ message }) => (
                  <p className="text-sm pt-1 text-red-600">{message}</p>
                )}
              ></ErrorMessage> */}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
          focus:bg-white focus:outline-none focus:placeholder-black text-black"
                {...register("password")}
              />
              {/* <ErrorMessage
                name="password"
                errors={errors}
                render={({ message }) => (
                  <p className="text-sm pt-1 text-red-600">{message}</p>
                )}
              ></ErrorMessage> */}
            </div>

            {/* <div className="text-right mt-2">
              <a
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >
                Forgot Password?
              </a>
            </div> */}

            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
            >
              Log In
            </button>
          </form>

          <hr className="my-6 border-gray-300 w-full" />

          <Link
            to="/signup"
            className="link-login-signup"
            style={{ fontWeight: 100 }}
          >
            <p className="text-blue-500 hover:text-blue-700 font-semibold pt-4 cursor-pointer">
              Need an account? Create an account
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
