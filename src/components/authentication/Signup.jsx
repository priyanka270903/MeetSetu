import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import storysetillustration from './Digital presentation-amico.svg'

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const { handleSignup } = useSignup();
  
  const handleFormSubmit = (data) => {
    handleSignup(data);
  };
  
  return (
    <div>
      <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="hidden lg:block w-full md:w-1/2 xl:w-1/2 h-screen">
          <img
            src={storysetillustration}
            alt=""
            className="object-cover"
            style={{width:'100%',height:'auto'}}
          />
        </div>

        <div
          className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto  md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
      flex items-center  sm:justify-center"
        >
          <div className="w-full h-100">
            <h1 className="text-xl md:text-2xl font-bold leading-tight text-black">
              Sign up
            </h1>

            <form className="mt-6" onSubmit={handleSubmit(handleFormSubmit)}>
              <div>
                <label className="block text-gray-700">User Name</label>
                <input
                  type="text"
                  placeholder="Enter User Name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:placeholder-black text-black focus:bg-white  focus:outline-none  "
                  {...register("username")}
                />
                {/* <ErrorMessage
                  name='username'
                  errors={errors}
                  render={({ message }) => (
                    <p className='text-sm pt-1 text-red-600'>{message}</p>
                  )}
                ></ErrorMessage> */}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white
                  focus:placeholder-black text-black focus:outline-none"
                  {...register("email")}
                />
                {/* <ErrorMessage
                  name='email'
                  errors={errors}
                  render={({ message }) => (
                    <p className='text-sm pt-1 text-red-600'>{message}</p>
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
                  name='password'
                  errors={errors}
                  render={({ message }) => (
                    <p className='text-sm pt-1 text-red-600'>{message}</p>
                  )}
                ></ErrorMessage> */}
              </div>
              {/* <div className='mt-4'>
                <label className='block text-gray-700'>Confirm Password</label>
                <input
                  type='password'
                  placeholder='Enter Confirm Password'
                  className='w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
              focus:bg-white focus:outline-none'
                  {...register('conpassword')}
                />
                <ErrorMessage
                  name='conpassword'
                  errors={errors}
                  render={({ message }) => (
                    <p className='text-sm pt-1 text-red-600'>{message}</p>
                  )}
                ></ErrorMessage>
              </div> */}

              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
                px-4 py-3 mt-6"
              >
                Sign Up
              </button>
            </form>

            <hr className="my-6 border-gray-300" />

            <Link to="/login">
              <p className="mt-8 text-blue-500 hover:text-blue-700 font-semibold cursor-pointer">
                Already have an account? Login
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
