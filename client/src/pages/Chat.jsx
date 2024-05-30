import React, { useRef,Fragment, useState, useEffect, useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';

import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';

import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';
// const user={
//   _id:"sdfsdfsdf",
//   name:"Sujit Kumar"

// }

const Chat = ({chatId,user}) => {
  const navigate=useNavigate();
  const containerRef=useRef(null);
  const bottomRef=useRef(null);
  const socket =getSocket();
  const dispatch=useDispatch();
  // console.log(chatDetails.data)
  const [message,setMessage]=useState("");
  const [page,setPage]=useState(1);
  const [messages,setMessages]=useState([]);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
  const [iamTyping,setIamTyping]=useState(false);
  const [userTyping,setUserTyping]=useState(false);
  // console.log(userTyping);
  const typingTimeout =useRef(null);
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
  const messageOnChange=(e)=>{
      setMessage(e.target.value)
      if(!iamTyping){
        socket.emit(START_TYPING,{members,chatId});
        setIamTyping(true);
      }
      if(typingTimeout.current)clearTimeout(typingTimeout.current);
    typingTimeout.current=  setTimeout(()=>{
        socket.emit(STOP_TYPING,{members,chatId});
        setIamTyping(false);
      },[2000]);
  };
  
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
      dispatch(removeNewMessagesAlert(chatId));
      return ()=>{
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      }
    },[chatId]);

    useEffect(()=>{
      if(bottomRef.current){
        bottomRef.current.scrollIntoView({behavior:"smooth"});
      }

    },[messages]);
    useEffect(()=>{
      if(!chatDetails.data?.chat)return navigate("/");
    },[]);

  const newMessagesHandler=useCallback((data)=>{// newMessagesListener
    // console.log(data);
    if(data.chatId!==chatId)return;
    setMessages((prev)=>[...prev,data.message]);
  },[chatId]);

  const startTypingListener=useCallback(
    (data)=>{
     if(data.chatId!==chatId)return;
   
    console.log("start typing",data);
    setUserTyping(true);
  },[chatId]);

  const stopTypingListener=useCallback(
    (data)=>{
     if(data.chatId!==chatId)return;
   
    console.log("stop typing",data);
    setUserTyping(false);
  },[chatId]);

   const alertListener = useCallback(
    (content) => {
      
      const messageForAlert = {
        content,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

 const eventHandler={
  [ALERT]:alertListener,
  [NEW_MESSAGE]:newMessagesHandler,
  [START_TYPING]:startTypingListener,
  [STOP_TYPING]:stopTypingListener,

 };
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
        <div  ref={bottomRef} >
          {userTyping && <TypingLoader />}
        </div>
        
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
          value={message} onChange={messageOnChange} />

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
