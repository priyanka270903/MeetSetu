import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function ParticipantsModal(props) {
const {
    meetDetails,showParticipantModal,setShowParticipantModal
} = props

  return (
    <>      
      <Modal
        show={showParticipantModal}
        onHide={() => {setShowParticipantModal(!showParticipantModal)}}
        backdrop="static"
        keyboard={false}     
        style={{overflowY:'scroll'}}   
      >
        <Modal.Header closeButton>
          <Modal.Title className='w-100 text-center'>Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3 justify-center"
        >
            <Tab eventKey="home" title="Host" className='text-center'>
                {meetDetails.host.email}
            </Tab>
            <Tab eventKey="profile" title="Allowed" className='text-center'>

                {meetDetails.allowed_participants.length > 0 ? meetDetails.allowed_participants.map((e) => (
                    <p>{e.email}</p>
                )):<p>No Allowed Participants</p>}
            </Tab>
            <Tab eventKey="contact" title="Black Listed" className='text-center'>
            {meetDetails.blacklisted_participants.length > 0 ? meetDetails.blacklisted_participants.map((e) => (
                    <p>{e.email}</p>
                )):<p>No Black Listed Participants</p>}
            </Tab>
        </Tabs>
        </Modal.Body>        
      </Modal>
    </>
  );
}

export default ParticipantsModal;