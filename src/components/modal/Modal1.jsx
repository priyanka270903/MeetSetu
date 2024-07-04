import Modal from "react-modal";

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
  type,
}) =>
  type === "private" ? (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onAfterOpen={() => getUserForPrivateMeeting()}
      contentLabel="Private Meeting Modal"
      style={{
        content: { width: "45%", marginInline: "auto" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <div className="">
        <h2>Private Meeting Modal</h2>
        <form>
          {userList?.map((user) => (
            <div key={user.id} className="flex items-center">
              <input
                type="checkbox"
                id={`user-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
              />
              <label htmlFor={`user-${user.id}`} className="ml-2">
                {user.email}
              </label>
            </div>
          ))}
          <button
            type="submit"
            onClick={() => {
              closeModal();
              handleCreateNewMeeting({ activeSlide, selectedUsers });
            }}
          >
            Start Meeting
          </button>
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
        content: { width: "45%", marginInline: "auto" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <div className="">
        <h2>One To One </h2>
        <form>
          {userList?.map((user) => (
            <div key={user.id} className="flex items-center">
              <input
                type="radio"
                id={`user-${user.id}`}
                checked={selectedUsers?.includes(user.id)}
                onChange={() => setSelectedUsers([user.id])}
              />
              <label htmlFor={`user-${user.id}`} className="ml-2">
                {user.email}
              </label>
            </div>
          ))}
          <button
            type="submit"
            onClick={() => {
              closeModal();
              handleCreateNewMeeting({ activeSlide, selectedUsers });
            }}
          >
            Start Meeting
          </button>
        </form>
      </div>
    </Modal>
  );

export default CustomModal;
