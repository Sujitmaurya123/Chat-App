import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'

import React, { Suspense, useState,lazy } from 'react'
import { orange } from '../../constants/color'
import {Menu as MenuIcon, Search as SearchIcon,
    Add as AddIcon ,Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications}from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'



const SearchDialog =lazy(()=> import("../specific/Search"));
const NotificationDialog=lazy(()=>import("../specific/Notifications"));
const NewGroupDialog=lazy(()=>import("../specific/NewGroup"));


const Header = () => {
    const navigate=useNavigate()


    const [isMobile,setIsMobile]=useState(false);
    const [isSearch,setIsSearch]=useState(false);
    const [isNewGroup,setIsNewGroup]=useState(false);
    const [isNotification,setIsNotification]=useState(false);


    const handleMobile=()=>{
        console.log("Mobile");
        setIsMobile(prev=>!prev)
    };

    const openSearch=()=>{
        console.log("openSearchDialog");
        setIsSearch(prev=>!prev);
    };

    const openNewGroup=()=>{
        setIsNewGroup(prev=>!prev);
    };
    const openNotification=()=>{
        setIsNotification(prev=>!prev);
    };

     const navigateToGroup=()=>navigate("/groups")

     const logoutHandler=()=>{
        console.log("logout");
     }

  return (
    <>
      <Box  sx={{flexGrow:1}} height={"4rem"} >
        <AppBar   position='static' sx={{
            bgcolor:orange,
        }} >
            <Toolbar>

        <Typography
        variant='h6'
        sx={{
            display:{xs:"none",sm:"block"},
        }}
        >Chattu</Typography>

        <Box  sx={{display:{xs:"block",sm:"none"}}}>
            <IconButton  color='inherit' onClick={handleMobile} >
                <MenuIcon/>
            </IconButton>
        </Box>
        <Box  sx={{flexGrow:1,}}

        />

        <Box>

            <IconBtn  title={"Serach"} icon={<SearchIcon/>}  onClick={openSearch} />
             <IconBtn  title={"New Group"} icon={<AddIcon/>}  onClick={openNewGroup} />
              <IconBtn  title={"Manage Groups"} icon={<GroupIcon/>}  onClick={navigateToGroup} />
              <IconBtn  title={"Logout"} icon={<LogoutIcon/>}  onClick={logoutHandler} />
              <IconBtn  title={"Notification"} icon={<Notifications/>}  onClick={openNotification} />

            {/* <Tooltip title="Search">
                <IconButton  color='inherit' size="large" onClick={openSearchDialog} >
                <SearchIcon/>
            </IconButton>
            </Tooltip> */}
           {/* <Tooltip  title="New Group" >
             <IconButton  color='inherit' size="large" onClick={openNewGroup  } >
                <AddIcon/>
            </IconButton>
           </Tooltip>
           <Tooltip  title="Manage Groups" >
             <IconButton  color='inherit' size="large" onClick={navigateToGroup  } >
                <GroupIcon/>
            </IconButton>
           </Tooltip> */}

        </Box>
            </Toolbar>
            
            </AppBar>
      </Box>

      {
        isSearch &&(
           <Suspense fallback={<div>Loading...</div>}>
             <SearchDialog/>
           </Suspense>
        )
      }
      {
        isNotification &&(
           <Suspense fallback={<div>Loading...</div>}>
             <NotificationDialog/>
           </Suspense>
        )
      }
      {
        isNewGroup &&(
           <Suspense fallback={<div>Loading...</div>}>
             <NewGroupDialog/>
           </Suspense>
        )
      }
    </>
  )
}


const IconBtn=({title,icon,onClick})=>{
return(
    <Tooltip  title={title}>
        <IconButton color='inherit' size='large'onClick={onClick} >
        {icon}
    </IconButton>

    </Tooltip>
)
}

export default Header
