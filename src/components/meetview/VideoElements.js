import React, { useRef,useEffect } from 'react'
import Card from 'react-bootstrap/Card';

function VideoElements(props) {
  const {user,stream} = props
  console.log(stream)
  const videoRef = useRef(null);
  useEffect(() => {
    // Set the srcObject when the component mounts or when the stream changes
    if (videoRef.current) {
      videoRef.current.srcObject = stream;      
    }

    // Clean up the stream when the component unmounts or when the stream changes
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);
  return (
    <>
        <div class="participant-card position-relative m-4">
          <div class="card-header text-center">            
          </div>
          <video ref={videoRef} style={{ width: '600px', height: '600px' }} autoPlay playsInline/>
        </div>
    </>
  )
}

export default VideoElements