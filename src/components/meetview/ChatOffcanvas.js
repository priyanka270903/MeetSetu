import { useEffect, useState,useRef } from 'react';
// import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Card from 'react-bootstrap/Card';
import { Switch } from '@mui/material';
import { MessageBox } from 'react-chat-elements'
import { Input } from 'react-chat-elements'
import { Button } from "react-chat-elements";


function ChatOffcanvas(props) {
    const {
        chatSocket,meetDetails,showChatOffcanvas,setShowChatOffcanvas,user
    }  = props
    const [adminOnly,setAdminOnly] = useState(false)    
    const [chats,setChats] = useState([])
    const [files,setFiles] = useState([])
    const [hostOnly,setHostOnly] = useState(false)
    const [message,setMessage] = useState('')
    chatSocket.onmessage = async (e) => {
        let data = JSON.parse(e.data)
        if(data.type == 'adminonly'){
            setHostOnly(data.adminonly)
        }
        if(data.type == 'chat'){
            setChats(prevArray => [...prevArray, data]);
        }
        if(data.type == 'file_upload'){
            setFiles(prevArray => [...prevArray, data])
        }
        console.log(chats)
    }

    useEffect(() => {
        console.log(chats)
    },[chats])

    useEffect(() => {
        if(chatSocket.readyState == WebSocket.OPEN){
            chatSocket.send(JSON.stringify({
                type:'adminonly',
                adminonly:adminOnly
            }))
        }
    },[adminOnly])
    
    const sendMessage = async () => {
        if(message.length > 0){
            chatSocket.send(JSON.stringify({            
                type:'chat',
                message:message,
                user:user
            }))  
            setMessage('')          
        }
    }
    function readFileAsDataUri(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
    }
    const sendDataUri = async (event) => {
        const file = event.target.files[0];
      
        if (file) {
          const dataUri = await readFileAsDataUri(file);
          chatSocket.send(JSON.stringify({            
                type:'file_upload',
                content:dataUri,
                fileName: file.name,
                fileType: file.type ,
                user:user
        }))
        }
    }    
    const DownloadFile = async(file_name,content) =>{
        let downloadLink = document.createElement('a');
        downloadLink.href = content;
        downloadLink.download = file_name
        downloadLink.click();
    }
    if(meetDetails){
        var chatBoxHeight = meetDetails.is_owner ? {display:'flex',flexDirection:'column',maxHeight:'100%',overflowY:'scroll'} : {display:'flex',flexDirection:'column',maxHeight:'100%',overflowY:'scroll'}
    }
  return (    
    <Offcanvas show={showChatOffcanvas} onHide={() => {setShowChatOffcanvas(!showChatOffcanvas)}} placement='end' backdrop='static' className="p-2 m-5 rounded-3">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chat Room</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
            {meetDetails?.is_owner && meetDetails?.is_owner == true? (
                <Card className='' style={{background:'rgb(241 243 244)',width:'100%',zIndex:'10'}}>
                    <Card.Body style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <p className='m-0'>Admin Only Chat </p>
                        <Switch onClick={() => setAdminOnly(!adminOnly)}/>
                    </Card.Body>                                                                                                                                                                                                                             
                </Card>
            ):null}
            <Card className='' style={{border:'none',position:'absolute', bottom:'0',width:'100%',maxHeight:'100%'}}>
                <Card.Body className="m-0 p-0 chatelement" style={chatBoxHeight}>
                    {chats.map((e,i) => (
                        <Card className='border-0'>   
                        <Card.Body>                     
                        <p key={i}>                            
                            {e.message}
                        </p>
                        <footer className="blockquote-footer">
                            <cite title="Source Title">{e.user}</cite>
                        </footer>                        
                    </Card.Body></Card>
                    ))}  
                    {files.map((e,i) => (
                        <Card className='border-2 chatelement'>   
                        <Card.Header className='' style={{overflowX:'scroll'}}>{e.fileName} </Card.Header>
                        <Card.Body className='border-0'>
                        <footer className="blockquote-footer m-0">
                            <cite title="Source Title">{e.user}</cite>
                        </footer>             
                    </Card.Body>
                    <Card.Footer className='bg-primary'>
                        <button className='btn btn-primary w-100' onClick={() => {DownloadFile(e.fileName,e.content)}}>Download</button>
                        </Card.Footer>
                    </Card>
                    ))}                        
                </Card.Body>                                                                                                                                                                                                                  
            </Card>            
        </Offcanvas.Body>
        {!hostOnly || meetDetails.is_owner? (
            <>
            <Input            
            placeholder="Type here..."
            multiline={false}
            className='m-2 p-2'
            onChange={(e) => {setMessage(e.target.value)}}
            value={message}            
        />
        <div>
            <Button text={"Send"} title="Send" onClick={sendMessage} className='w-100'/> 
            <input type="file" className="mt-3 form-control" id="fileupload" onChange={(e) => sendDataUri(e)} accept="image/*,application/pdf"/>
        </div>
        </>
        ):null}
    </Offcanvas>    
  );
}

export default ChatOffcanvas