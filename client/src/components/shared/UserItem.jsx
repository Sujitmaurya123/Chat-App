import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'
import { Add as AddIcon,Remove as RemoveIcon  } from "@mui/icons-material";


const UserItem = ({user,handler,handlerIsLoading,isAdded=false}) => {
    const {name,_id,avatar}=user;

  return (

    <ListItem>
        <Stack  direction={"row"}
        alignItems={'center'}
        spacing={"1rem"}
        width={"100%"}
        >
            <Avatar/>
            <Typography
            variant="body1"
             sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
           width:"100%",
          }}
            
            >{name}</Typography>
        <IconButton
        size="small"
        sx={{
            bgcolor:isAdded?"error.main":"blue",
            color:"white",
            "&:hover": {
                bgcolor:isAdded?"error.dark":"black",
            }
        }}

        onClick={()=> handler(_id)} disabled ={handlerIsLoading}  >

          {
            isAdded?<RemoveIcon />:<AddIcon/>
          }
           
        </IconButton>
        </Stack>
    </ListItem>
  )
   
  
}

export default memo(UserItem)
