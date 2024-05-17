import React from 'react'
import Header from './Header';
import  Title  from '../shared/Title';
import { Grid } from '@mui/material';
import ChatList from '../specific/ChatList';
import { sampleChats } from '../../constants/sampleData.js';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile.jsx';
const AppLayout = () =>(WrappedComponent)=> {
    return (props)=>{

       const params=useParams();
       const chatId=params.chatId;

       const handleDeleteChat=(e,_id,groupChat)=>{
        e.preventDefault();
        console.log("Delete Chat",_id,groupChat);

       };

     return (

    <>
        <Title/>
      <Header/>

      <Grid container style={{ height: "calc(100vh - 4rem)" }}>

      {/* first part of home chats */}

        <Grid  item  height={"100%"} 
        sm={4}
        md={3}
        sx={{
            display:{xs:"none",sm:"block"},
        }}
        >
            <ChatList chats={sampleChats}  chatId={chatId} handleDeleteChat={handleDeleteChat}
            newMessagesAlert={[
              {
              chatId, 
              count:4,
              },
            ]}
            onlineUsers={["1","2"]}
            /></Grid>

         {/* Second part of home chats */}

          <Grid  item xs={12} sm={8} md={5} lg={6} height={"100%"} >

      <WrappedComponent {...props}/>
          </Grid>

                 {/* Third part of home chats */}

  <Grid  item md={4} lg={3} height={"100%"}
    sx={{
        display:{xs:"none",sm:"block"},
        padding:"2rem",
        bgcolor:"rgba(0,0,0,0.85)"
    }}
  >     <Profile/>
  
  </Grid>
      </Grid>
      
    </>
  );
};
};

export default AppLayout
