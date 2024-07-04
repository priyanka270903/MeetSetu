import React from "react";
import { useAVToggle } from "@100mslive/react-sdk";
import {
    selectIsConnectedToRoom,
    useHMSActions,
    useHMSStore,
    selectPeers,
  } from "@100mslive/react-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneSlash, faMicrophone, faVideo, faVideoSlash,faUserPlus, 
         faArrowUpRightFromSquare, faMessage, faFaceSmile, faGear, faEllipsis
} from "@fortawesome/free-solid-svg-icons";

function Footer() {

    const {isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
    } = useAVToggle();

    return (
        <div className="main_control">
             <div className="main_controls_button" onClick={toggleAudio}>
                {isLocalAudioEnabled ? (
                <><FontAwesomeIcon icon={faMicrophoneSlash} size="lg" /><span 
                  className="button_name">Mute</span></>
                ): (
                <><FontAwesomeIcon icon={faMicrophone} size="lg" /><span 
                  className="button_name">Unmute</span></>
                )}
                </div>
                <div className="main_controls_button" onClick={toggleVideo}>
                {isLocalVideoEnabled ? (
                <><FontAwesomeIcon icon={faVideoSlash} size="lg" /><span 
                  className="button_name">Stop Video</span></>
                ): (
                <><FontAwesomeIcon icon={faVideo} size="lg" /><span 
                  className="button_name">Start Video</span></>
                )}
                </div>
        </div>
    )
}

export default Footer;