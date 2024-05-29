import React, { useRef,Fragment, useState, useEffect, useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';

import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';

import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
// const user={
//   _id:"sdfsdfsdf",
//   name:"Sujit Kumar"

// }

const Chat = ({chatId,user}) => {
  const containerRef=useRef(null);
  const socket =getSocket();
  const dispatch=useDispatch();
  // console.log(chatDetails.data)
  const [message,setMessage]=useState("");
  const [page,setPage]=useState(1);
  const [messages,setMessages]=useState([]);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
  const chatDetails=  useChatDetailsQuery({chatId,skip:!chatId})

  const oldMessagesChunk=useGetMessagesQuery({chatId,page})

  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(containerRef,
    oldMessagesChunk.data?.totalPages,
    page,setPage,oldMessagesChunk.data?.messages
  );

  const errors=[{isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error},
  ];
  // console.log("oldMessage Chunk",oldMessagesChunk.data);
  const members=chatDetails?.data?.chat?.members;
  
  const handleFileOpen=(e)=>{
      dispatch(setIsFileMenu(true));
      setFileMenuAnchor(e.currentTarget)
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    if(!message.trim())return;
    // Emitting to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message});

    setMessage("");

  }

    useEffect(()=>{

      return ()=>{
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      }
    },[chatId]);

  const newMessagesHandler=useCallback((data)=>{
    // console.log(data);
    if(data.chatId!==chatId)return;
    setMessages((prev)=>[...prev,data.message]);
  },[chatId]);

 const eventHandler={[NEW_MESSAGE]:newMessagesHandler};
 useSocketEvents(socket,eventHandler);
  useErrors(errors);
  const allMessages=[...oldMessages,...messages];

  

  return chatDetails.isLoading?(<Skeleton />): (
    <Fragment>
      <Stack   
      ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={grayColor}
      height={"90%"}
      sx={{
        overflow:"hidden",
        overflowY:"auto"
      }}
      >
      
       

        {
          allMessages.map((i)=>(
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }
        
      </Stack>

      <form   
      style={{
        height:"10%",
      }}
      onSubmit={submitHandler}
      >
        <Stack   direction={"row"} height={"100%"}
        padding={"1rem"} alignItems={"center"} position={"relative"} >
          <IconButton   
          sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Type Message Here...'
          value={message} onChange={(e)=>setMessage(e.target.value)} />

          <IconButton  type='submit'
          sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  )
}

export default AppLayout()(Chat);
