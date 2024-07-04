import React, { useState,useEffect,useMemo, useRef } from "react";
import Modal from "react-modal";
import Header from "../components/common/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Conference from "../media/img/conference.png";
import FaceToFace from "../media/img/face-to-face.png";
import Public from "../media/img/public.png";
import AskToJoin from "../media/img/ask-to-join.png";
import "../media/styles/HomePage.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Link } from "react-router-dom";
import useHome from "../hooks/useHome";
import CustomModal from "../components/modal/Modal";

const Homepage = () => {
  const { handleCreateNewMeeting,JoinMeeting,getUserForPrivateMeeting, userList } =
    useHome();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const meetUID = useRef('')
  console.log('loaded')
  const join_meeting = async () => {
      await JoinMeeting(meetUID.current)
  }
  
  const handleMeeting = () => {
    console.log(activeSlide);
    if (activeSlide.type === "public" || activeSlide.type === "asktojoin") {
      handleCreateNewMeeting({ activeSlide });
    }
    if (activeSlide.type === "private" || activeSlide.type === "onetoone") {
      setModalIsOpen(true);
    }
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleCheckboxChange = (userId) => {
    // Toggle the user's selection status
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };
  const slides = [
    {
      id: 1,
      type: "private",
      image: Conference,
      title: "Private",
      description: "Exclusive to users chosen by the host, ensuring controlled access for confidential discussions or team collaborations.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={33}
          height={33}
          fill="black"
          className="bi bi-telephone-forward fill-indigo-600"
          viewBox="0 0 16 16"
        >
          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zm10.762.135a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L14.293 4H9.5a.5.5 0 0 1 0-1h4.793l-1.647-1.646a.5.5 0 0 1 0-.708z" />
        </svg>
      ),
    },
    {
      id: 2,
      type: "onetoone",
      image: FaceToFace,
      title: "One on One",
      description: "Involves only the host and one other person for focused and personalized interactions, suitable for private conversations or mentorship.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={33}
          height={33}
          fill="currentColor"
          className="bi bi-person-bounding-box fill-indigo-600"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        </svg>
      ),
    },
    {
      id: 3,
      type: "public",
      image: Public,
      title: "Public",
      description: "A fully open forum where any user can join without approval. Ideal for inclusive discussions with a diverse audience.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={33}
          height={33}
          fill="currentColor"
          className="bi bi-people fill-indigo-600"
          viewBox="0 0 16 16"
        >
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
      ),
    },
    {
      id: 4,
      type: "asktojoin",
      image: AskToJoin,
      title: "Ask to Join",
      description: "Requires user approval before joining, allowing hosts to curate attendees based on specific criteria, balancing inclusivity and control.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={33}
          height={33}
          fill="currentColor"
          className="bi bi-person-raised-hand fill-indigo-600"
          viewBox="0 0 16 16"
        >
          <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a.998.998 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
          <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
        </svg>
      ),
    },
  ];

  const [swiper, setSwiper] = useState(slides[0]);
  const [activeSlide, setActiveSlide] = useState(slides[0]);
  const handleSwiper = (swiper) => {
    setSwiper(swiper);
  };

  const handleSlideChange = () => {
    const activeSlide = slides[swiper?.activeIndex];
    setActiveSlide(activeSlide);
  };
  const id = "sfadsljfs";

  return (
    <>
      <Header />
      <div className="flex justify-around items-center ">
        <div className="w-80 z-0 text-center ms-28 my-5 border-2 shadow-xl shadow-indigo-300 rounded-full p-10 relative ">
          <Swiper
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div>
                  <img src={slide.image} alt={slide.title} />
                  <div>{slide.title}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full mx-auto text-center capitalize   ">
          <div className="text-6xl text-left ms-32 animate-pulse">
            <h2 className="font-light inline-block ">
              {activeSlide?.title}{" "}
              <span className="inline-block ">{activeSlide.svg}</span>
            </h2>
          </div>
          <div className="py-5 text-left ms-32 font-light">
            <p>{activeSlide?.description}</p>
          </div>
          <div className=" w-10/12 mx-auto flex  justify-evenly items-center ">
            <Link
              // to={`/meet/${id}`}
              onClick={() => {
                handleMeeting();
              }}
            >
              <button className="border border-violet-400 bg-indigo-500 text-white font-medium p-3 rounded hover:bg-indigo-600">
                Create Your Own Meeting
              </button>
            </Link>
            <span>OR</span>
            <div className="flex ms-1 p-3">
              <input
                placeholder="Enter your code here..."
                className="p-3 rounded-xl focus:ring-0 border focus:outline-none focus:border-violet-500 outline-1  focus:border-transparent rounded-bl-xl rounded-tl-xl rounded-br-none focus:border-r-0 rounded-tr-none"
                onChange={(e) => {meetUID.current = e.target.value}}
              />
              <button className="px-4 py-2 border border-violet-700 bg-violet-300 text-violet-950  rounded-br-xl rounded-tr-xl hover:bg-violet-700 hover:text-white " onClick={join_meeting}>
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeSlide.type === "private" && (
        <CustomModal
          activeSlide={activeSlide}
          closeModal={closeModal}
          getUserForPrivateMeeting={getUserForPrivateMeeting}
          handleCheckboxChange={handleCheckboxChange}
          handleCreateNewMeeting={handleCreateNewMeeting}
          modalIsOpen={modalIsOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          type={activeSlide.type}
          userList={userList}
        />
      )}
      {activeSlide.type === "onetoone" && (
        <CustomModal
          activeSlide={activeSlide}
          closeModal={closeModal}
          getUserForPrivateMeeting={getUserForPrivateMeeting}
          handleCheckboxChange={handleCheckboxChange}
          handleCreateNewMeeting={handleCreateNewMeeting}
          modalIsOpen={modalIsOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          type={activeSlide.type}
          userList={userList}
        />
      )}
    </>
  );
};

export default Homepage;
