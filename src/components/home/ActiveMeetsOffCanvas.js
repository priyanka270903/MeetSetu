import React, { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import useHome from '../../hooks/useHome';
import Toast from 'react-bootstrap/Toast';


function ActiveMeetsOffCanvas(props) {
    const {GetActiveMeetings} = useHome()    
    const {showActiveMeets,setShowActiveMeets} = props
    const [activeMeets,setActiveMeets] = useState(null)
    const setActiveMeetings = () => {
        GetActiveMeetings().then((data) => {
            console.log(data)
            setActiveMeets(data)            
        })
    }
  return (
    <Offcanvas show={showActiveMeets} onHide={() => {setShowActiveMeets(!showActiveMeets)}} placement='end' className="rounded-4 m-4 p-2" onEntering={setActiveMeetings}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Active Meetings</Offcanvas.Title>
    </Offcanvas.Header>
        <Offcanvas.Body className='d-flex' style={{flexDirection:'column',alignItems:'center'}}>
            {activeMeets && activeMeets.length > 0 ?(
                activeMeets.map((e) => (
                <Toast className='m-2'>
                    <Toast.Header>                      
                      <strong className="me-auto">{e.UID}</strong>
                      <small>{e.type} | {e.status}</small>
                    </Toast.Header>
                    <Toast.Body>Created At - {String(new Date(e.created_at).getHours()).padStart(2,"00")}:{String(new Date(e.created_at).getMinutes()).padStart(2,"00")}</Toast.Body>
                </Toast>
                ))
            ):null}
     </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ActiveMeetsOffCanvas