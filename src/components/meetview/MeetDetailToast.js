import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


function MeetDetailToast(props) {
    const {
        meetDetailToast,showMeetDetailToast,show,onClose,UID,type,status,host
    } = props    
  return (
    <ToastContainer position="bottom-end" className='pb-5 mb-5 mr-5' style={{marginBottom:'5rem !important'}}>
        <Toast show={meetDetailToast} onClose={() => {showMeetDetailToast(!MeetDetailToast)}}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{UID}</strong>
        <small>{type} | {status}</small>
      </Toast.Header>
      <Toast.Body>HOST - {host}</Toast.Body>
    </Toast>
    </ToastContainer>
  );
}

export default MeetDetailToast;