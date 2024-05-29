import React, { useCallback } from 'react'
import Header from './Header';
import  Title  from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';

import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile.jsx';
import { useMyChatsQuery } from '../../redux/api/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../redux/reducers/misc.js';
import { useErrors, useSocketEvents } from '../../hooks/hook.jsx';
import { getSocket } from '../../socket.jsx';
import {  NEW_MESSAGE_ALERT, NEW_REQUEST } from '../../constants/events.js';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js';
const AppLayout = () =>(WrappedComponent)=> {
    return (props)=>{

       const params=useParams();
       const dispatch=useDispatch();
       const chatId=params.chatId;

        const socket=getSocket();
        // console.log(socket);

       const {isMobile}=useSelector((state)=>state.misc);
      const {user}=useSelector((state)=>state.auth);
      const {newMessagesAlert}=useSelector((state)=>state.chat);

      console.log(newMessagesAlert);

       const {isLoading,data,isError,error,refetch}=useMyChatsQuery("")

      useErrors([{isError,error}]);

       const handleDeleteChat=(e,_id,groupChat)=>{
        e.preventDefault();
        console.log("Delete Chat",_id,groupChat);

       };
       const handleMobileClose=()=> dispatch(setIsMobile(false));
       const newMessageAlertHandler=useCallback((data)=>{
              dispatch(setNewMessagesAlert(data))
        // const sds=data.chatId;
        //       console.log("Newmss",sds);
       },[]);

       const newRequestHandler=useCallback(()=>{
        dispatch(incrementNotification());

       },[dispatch]);


       const eventHandlers={
        [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
        [NEW_REQUEST]:newRequestHandler,
       };

       useSocketEvents(socket,eventHandlers);

     return (

    <>
        <Title/>
      <Header/>

      {
        isLoading ?(<Skeleton />):(
          <Drawer open={isMobile}  onClose={handleMobileClose} >

           <ChatList   w="70vw" chats={data?.chats }  
           chatId={chatId} handleDeleteChat={handleDeleteChat}
           newMessagesAlert={newMessagesAlert}
           />
          </Drawer>
        )
      }

      <Grid container style={{ height: "calc(100vh - 4rem)" }}>

      {/* first part of home chats */}

        <Grid  item  height={"100%"} 
        sm={4}
        md={3}
        sx={{
            display:{xs:"none",sm:"block"},
        }}
        >
          {
            isLoading ?(<Skeleton />):(
              <ChatList chats={data?.chats }  chatId={chatId} handleDeleteChat={handleDeleteChat}
              user={user}
              newMessagesAlert={newMessagesAlert}
            />
            )
          }
            </Grid>

         {/* Second part of home chats */}

          <Grid  item xs={12} sm={8} md={5} lg={6} height={"100%"} >

      <WrappedComponent {...props} chatId={chatId}  user={user}  />
          </Grid>

                 {/* Third part of home chats */}

  <Grid  item md={4} lg={3} height={"100%"}
    sx={{
        display:{xs:"none",sm:"block"},
        padding:"2rem",
        bgcolor:"rgba(0,0,0,0.85)"
    }}
  >     <Profile  user={user} />
  
  </Grid>
      </Grid>
      
    </>
  );
};
};

export default AppLayout
