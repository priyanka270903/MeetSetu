import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMeetInfo from "../hooks/useMeetInfo";
import { useEffect } from "react";
import MeetDetailToast from "../components/meetview/MeetDetailToast";
import ParticipantsModal from "../components/meetview/ParticipantsModal";
import ChatOffcanvas from "../components/meetview/ChatOffcanvas";
import { base_url_socket } from "../utils/constant";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "react-chat-elements/dist/main.css"
import VideoElements from "../components/meetview/VideoElements";

const MeetView = () => {
  var servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };  
  const webcamRef = React.useRef(null);
  const [meetingInfoPopUp, setMeetingInfoPopUp] = useState(false);  
  const { activeMeeting } = useAuth();
  const { id } = useParams();
  const [meetDetails,setMeetDetails] = useState(null)  
  const [createdAt,setCreatedAt] = useState(null)
  const [meetDetailToast, showMeetDetailToast] = useState(false); 
  const [showParticipantModal, setShowParticipantModal] = useState(false);  
  const [showChatOffcanvas, setShowChatOffcanvas] = useState(false);  
  const [chatSocket,setChatSocket] = useState(null)
  const [signalingSocket,setSignalingSocket] = useState(null)
  const [user,setUser] = useState(localStorage.getItem('user'))
  const [localPeerObject,setLocalPeerObject] = useState(null)
  const [audio,setAudio] = useState(true)
  const [video,setVideo] = useState(true)  
  const [localPeerObjects,setLocalPeerObjects] = useState({})
  const [localPeerObjectsICE,setLocalPeerObjectsICE] = useState({})
  const [remotePeerObjects,setRemotePeerObjects] = useState({})
  const navigate = useNavigate()
  const [localStream,setLocalStream] = useState(false)
  const remoteStreams = useRef([])
  const ICECandidates = useRef({})
    
  useMeetInfo({meetDetails:meetDetails,setMeetDetails:setMeetDetails});
  useEffect(() => {
    if(meetDetails){
      const dateObject = new Date(meetDetails.created_at);
      const hour = String(dateObject.getHours()).padStart(2,"0");
      const minute = String(dateObject.getMinutes()).padStart(2, "0");
      setCreatedAt(`${hour}:${minute}`)
    }
  },[meetDetails])  

  useEffect(() => {   
    if(!signalingSocket && !chatSocket){
      setSignalingSocket(new WebSocket(`${base_url_socket}/signaling/${id}/`))
      setChatSocket(new WebSocket(`${base_url_socket}/chat/${id}/`))      
    }
  },[])

  const CloseAll = async (callback) => {
    chatSocket.close();
    signalingSocket.close();    
    localStream.getAudioTracks()[0].enabled=audio
    localStream.getVideoTracks()[0].enabled=video
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    callback();
  };
    
  useEffect(() => {
    if(localStream){
      localStream.getAudioTracks()[0].enabled=audio
      localStream.getVideoTracks()[0].enabled=video
    }
  },[audio,video])

  if (signalingSocket) {
    signalingSocket.onmessage = async (e) => {
      let data = JSON.parse(e.data);
      if (data.action === 'joined') {
        let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })        
        setLocalStream(localStream)
        signalingSocket.send(JSON.stringify({
          action: 'new_peer'
        }));
      }
      if (data.action === 'you_left') {
        await CloseAll(() => navigate('/'));
      }
      if(data.action === 'new_peer'){
        // Send the offer        
        let localPeerObject = new RTCPeerConnection(servers)    
        localStream.getTracks().forEach((track) => {                 
            localPeerObject.addTrack(track, localStream);          
        })
        console.log(localPeerObject)
        setLocalPeerObject(localPeerObject)        
        remoteStreams.current = [...remoteStreams.current, new MediaStream()];
        localPeerObject.ontrack = async (event) => {
          let media = new MediaStream()
          event.streams[0].getTracks().forEach((track) => {            
            media.addTrack(track)          
            remoteStreams.current[remoteStreams.current.length - 1].addTrack(track);            
          });
          // console.log
        }
        setLocalPeerObjects(prevState => ({
          ...prevState,  // Copy existing state
          [data.new_peer]: localPeerObject   // Add new key-value pair
        }));   
        localPeerObject.onicecandidate = async (e) => {
          try {
            signalingSocket.send(JSON.stringify({
              action:'onicecandidate',
              channel_name:data.new_peer,
              candidate:e.candidate.toJSON()
            }))
          } catch (error) {
            console.log(error)
          }
        }      
        const offerDescription = await localPeerObject.createOffer();
        await localPeerObject.setLocalDescription(offerDescription);
        signalingSocket.send(JSON.stringify({
          'action':'offer',
          'channel_name':data.new_peer,
          'sdp_offer':offerDescription
        }))
      }
      if(data.action === 'offer' && data.sdp_offer){        
        // Send an answer 
        remoteStreams.current = [...remoteStreams.current, new MediaStream()];
        let localPeerObject = new RTCPeerConnection(servers)        
        localStream.getTracks().forEach((track) => {                        
            localPeerObject.addTrack(track, localStream);          
        })        
        localPeerObject.ontrack = async (event) => {          
          event.streams[0].getTracks().forEach((track) => {            
            console.log(track)
            remoteStreams.current[remoteStreams.current.length - 1].addTrack(track);
          });
          console.log(remoteStreams)          
        } 
        setLocalPeerObjectsICE(prevState => ({
          ...prevState,  // Copy existing state
          [data.sender_channel]: localPeerObject   // Add new key-value pair
        }));
        setLocalPeerObject(localPeerObject)        
        console.log(data.sdp_offer)
        await localPeerObject.setRemoteDescription(new RTCSessionDescription(data.sdp_offer))
        let sdp_answer = await localPeerObject.createAnswer();        
        await localPeerObject.setLocalDescription(sdp_answer);  
        if(ICECandidates.current[data.sender_channel]){
        ICECandidates.current[data.sender_channel].map((e) => {
          localPeerObject.addIceCandidate(new RTCIceCandidate(e))
        })
      }        
        signalingSocket.send(JSON.stringify({
          'action':'answer',          
          'sdp_answer':sdp_answer,
          'sender_channel':data.sender_channel
        }))
      }if(data.action === 'answer' && data.sdp_answer){        
        // Got the answer
        // Get the localconnection with the peer that sent the answer
        await localPeerObjects[data.channel_name].setRemoteDescription(data.sdp_answer)                
      }if(data.action === 'onicecandidate' && data.channel_name && data.sender_channel && data.candidate){  
        try{
          console.log(data.candidate)
          ICECandidates.current[data.sender_channel] = [
            ...(ICECandidates.current[data.sender_channel] || []),
            data.candidate,
          ];
          console.log(ICECandidates.current)
          // if(localPeerObjectsICE[data.sender_channel]){
          //   console.log('in if',localPeerObjectsICE[data.sender_channel])
          //   localPeerObjectsICE[data.sender_channel].addIceCandidate(new RTCIceCandidate(data.candidate));            
          // }else{
          //   console.log('in else',data.candidate  )
          // }
        }catch (error) {
          console.log(error) 
        }        
      }
    };
  }

  // useEffect(() => {
  //   if(localStream){
  //     localStream.getAudioTracks()[0].enabled=audio
  //     localStream.getVideoTracks()[0].enabled=video
  //   }
  // },[audio,video])

  const endMeeting= async () => {
      signalingSocket.send(JSON.stringify({
          action:'peer_left'
      }))
  }
  // console.log(meetDetails);
  const handleActivePopUp = () => {
    setMeetingInfoPopUp((prev) => !prev);
  };
  return (
    <div className="relative  h-screen">      
        {/* Left side: Camera view */}
        <div className="w-100 d-flex" style={{flexDirection:'row',height:'90vh',flexWrap:'wrap',overflowX:'scroll',justifyContent:'center'}}>
          {localStream && (<VideoElements stream={localStream} user={user}/>)}
          {remoteStreams.current && remoteStreams.current.length > 0 ? remoteStreams.current.map((e) => (
            (<VideoElements stream={e} user={user}/>) 
          )) : null}          
        </div>
        {/* Right side: Meeting participants */}              
      <div className="absolute bottom-0  text-black w-full flex  justify-between p-4">
        <div>
          <div className="relative">
            <div className="hover:cursor-pointer" onClick={handleActivePopUp}>
                <p>
                  {createdAt} | {id}
                </p>
            </div>
          </div>
        </div>    
        <div>              
          <button type="button" className="btn mx-2 p-2 btn-outline-success" onClick={() => {setAudio(!audio)}} style={{border:'1px solid',borderRadius:'50%'}}>
            {audio? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic" viewBox="0 0 16 16">
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
            </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-mute" viewBox="0 0 16 16">
  <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3"/>
  <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
</svg>)}   
          </button>
          <button type="button" className="btn btn-outline-primary mx-2 p-2" onClick={() => {setVideo(!video)}} style={{border:'1px solid',borderRadius:'50%'}}>
            {video? (  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-video" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"></path>
                                  </svg>                  ): (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-video-off" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56-10-14 .814-.58 10 14-.814.58"/>
                  </svg>)}
                
          </button>
          <button type="button" className="btn-lg btn btn-outline-danger mx-2 p-2" onClick={endMeeting}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
                    <path d="M7.5 1v7h1V1z"/>
                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
                </svg>
          </button>
        </div>
        <div>
            <button type="button" className="btn  mx-2 p-2" onClick={() => {showMeetDetailToast(!meetDetailToast)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
              </svg>
            </button>
            <button type="button" className="btn mx-2 p-2" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16" onClick={() => {setShowParticipantModal(!showParticipantModal)}}>
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
              </svg>
            </button>
            <button type="button" className="btn-lg btn  mx-2 p-2" onClick={() => {setShowChatOffcanvas(!showChatOffcanvas)}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            </svg>
            </button>
        </div>
      </div>
      {meetDetails && (
      <>
        <MeetDetailToast
          meetDetails={meetDetails}
          UID={id}
          type={meetDetails.type}
          status={meetDetails.status}
          host={meetDetails.host.email}
          meetDetailToast={meetDetailToast}
          showMeetDetailToast={showMeetDetailToast}
        />
        <ParticipantsModal meetDetails={meetDetails} showParticipantModal={showParticipantModal} setShowParticipantModal={setShowParticipantModal}/>
        {chatSocket?<ChatOffcanvas user={user} chatSocket={chatSocket} meetDetails={meetDetails} showChatOffcanvas={showChatOffcanvas} setShowChatOffcanvas={setShowChatOffcanvas}/>: null}
      </>
    )}
    </div>
  );
};

export default MeetView;