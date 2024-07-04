import Modal from "react-modal";
import { animated } from "@react-spring/web";
import { useState } from "react";
import "./Modal.css";
const CustomModal = ({
  modalIsOpen,
  closeModal,
  getUserForPrivateMeeting,
  userList,
  selectedUsers,
  handleCheckboxChange,
  handleCreateNewMeeting,
  activeSlide,
  setSelectedUsers,
  userListLoading,
  type,
}) => {

  return type === "private" ? (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onAfterOpen={() => getUserForPrivateMeeting()}
      contentLabel="Private Meeting Modal"
      style={{
        content: { width: "45%", marginInline: "auto", overflow: "hidden" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
    >
      <div className="text-center overflow-y-hidden  ">
        <h2 className="text-3xl border-b-2 border-b-indigo-800 text-indigo-950 font-light pb-2">
          Available Participants{" "}
        </h2>
        <form className="p-5  mt-3 text-left">
          {userList.length > 0
            ? userList.map((user) => (
                <div className="flex flex-col font-light line-clamp-2 tracking-wider ">
                  <div className="flex items-center px-3 ms-2 mb-2 ">
                    <animated.input
                      className="accent-violet-800 cursor-pointer h-6 w-6   "
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                    <label
                      className="ms-3 text-violet-900"
                      htmlFor={`user-${user.id}`}
                    >
                      {user.email}
                    </label>
                  </div>
                </div>
              ))
            : userListLoading && (
                <>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                </>
              )}
          <div className="w-[90%] mx-auto scroll-none mt-72 overflow-y-hidden h-16 relative ">
            <button
              className={`bg-indigo-900  text-indigo-100  rounded-lg text-xl font-medium absolute  w-full h-full ${
                selectedUsers.length > 0
                  ? "cursor-pointer hover:bg-indigo-950"
                  : " cursor-not-allowed bg-indigo-300 text-indigo-900"
              }  `}
              type="submit"
              onClick={() => {
                closeModal();
                handleCreateNewMeeting({ activeSlide, selectedUsers });
              }}
              disabled={selectedUsers.length > 0 ? false : true}
            >
              Start Meeting
            </button>
          </div>
        </form>
      </div>
    </Modal>
  ) : (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onAfterOpen={() => getUserForPrivateMeeting()}
      contentLabel="Private Meeting Modal"
      style={{
        content: { width: "45%", marginInline: "auto", overflow: "hidden" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
    >
      <div className="text-center overflow-y-hidden">
        <h2 className="text-3xl border-b-2 border-b-indigo-800 text-indigo-950 font-light pb-2">
          One To One{" "}
        </h2>
        <form className="p-5  mt-3 text-left">
          {userList.length > 0
            ? userList.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col font-light line-clamp-2 tracking-wider"
                >
                  <div className="flex items-center px-3 ms-2 mb-2">
                    <input
                      className="accent-violet-800 cursor-pointer h-6 w-6"
                      type="radio"
                      id={`user-${user.id}`}
                      checked={selectedUsers?.includes(user.id)}
                      onChange={() => setSelectedUsers([user.id])}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="ms-3 text-violet-900"
                    >
                      {user.email}
                    </label>
                  </div>
                </div>
              ))
            : userListLoading && (
                <>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                  <div className="ms-6 mb-2">
                    <div className="animate-pulse inline-block w-6 h-5 bg-indigo-400" />
                    <span className="w-6"> </span>
                    <div className="animate-pulse inline-block w-56 h-5 bg-indigo-400" />
                  </div>
                </>
              )}

          <div className="w-[90%] mx-auto scroll-none mt-72 overflow-y-hidden h-16 relative ">
            <button
              className={`bg-indigo-900  text-indigo-100  rounded-lg text-xl font-medium absolute  w-full h-full ${
                selectedUsers.length > 0
                  ? "cursor-pointer hover:bg-indigo-950"
                  : " cursor-not-allowed bg-indigo-300 text-indigo-900"
              }  `}
              type="submit"
              onClick={() => {
                closeModal();
                handleCreateNewMeeting({ activeSlide, selectedUsers });
              }}
              disabled={selectedUsers.length > 0 ? false : true}
            >
              Start Meeting
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CustomModal;