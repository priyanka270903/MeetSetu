import React from 'react'

function MeetingDetails(props) {
    const {meetDetails} = props    
    console.log(meetDetails)
  return (
    <>
    {meetDetails?(<div className="container mt-5">
      <h2>Meeting Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Meeting UID: {meetDetails.UID}</h5>
          <p className="card-text">Type: {meetDetails.type}</p>
          <p className="card-text">Status: {meetDetails.status}</p>
          <p className="card-text">Created At: {meetDetails.created_at}</p>
          <p className="card-text">Is Owner: {meetDetails.is_owner ? 'Yes' : 'No'}</p>

          <h4>Host Information</h4>
          <p>Email: {meetDetails.host.email}</p>

          <h4>Allowed Participants</h4>
          <ul>
            {meetDetails.allowed_participants.map((participant) => (
              <li key={participant.id}>{participant.email}</li>
            ))}
          </ul>

          <h4>Blacklisted Participants</h4>
          <ul>
            {meetDetails.blacklisted_participants.map((participant) => (
              <li key={participant.id}>{participant.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>):null}    
    </>
  )
}

export default MeetingDetails