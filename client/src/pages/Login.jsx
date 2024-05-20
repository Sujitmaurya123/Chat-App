import React, { useState } from 'react'
import {Button, Container,Paper, TextField, Typography,Stack, Avatar, IconButton} from "@mui/material"

import {CameraAlt as CameraAltIcon} from "@mui/icons-material"
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import{useFileHandler, useInputValidation} from '6pp'
import { usernameValidator } from '../utils/validators';
import { bgGradient } from '../constants/color';
const Login = () => {

    const [isLogin,setIsLogin]=useState(true);
    const toggleLogin =()=>setIsLogin((prev)=>!prev)
    const name=useInputValidation("");
    const bio=useInputValidation("");
    const username=useInputValidation("",usernameValidator);
    const password=useInputValidation(""); 

    const avatar=useFileHandler("single");

    const handleLogin=(e)=>{
        e.preventDefault();

    }
    const handleSignUp=(e)=>{
        e.preventDefault();
        
    }

  return (
    <div
    style={{
        backgroundImage:bgGradient,
    }}
    >

   
    <Container component={"main"} maxWidth="xs"
    sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    }} >
        <Paper  elevation={3}
        sx={{
            padding:4,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
        }}  
        >
{
    isLogin?(<>
        <Typography variant='h5'>Login</Typography>
        <form style={{
            width:"100%",
            margin:'1rem',

        }}
         onSubmit={handleLogin}
        >
            <TextField 
            required
             fullWidth 
             label="Username"
             margin='normal'
             variant='outlined'
             value={username.value}
             onChange={username.changeHandler}
             />
             <TextField 
            required
             fullWidth 
             label="Password"
             type='password'
             margin='normal'
             variant='outlined'
             value={password.value}
             onChange={password.changeHandler}
             />

        <Button 
        sx={{
            
        }}
        fullWidth
        variant='contained'
        color='primary'
        type='submit'
        >
            Login
        </Button>
        <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
        <Button
        
        fullWidth
        variant='text'
       
        onClick={toggleLogin}
        >
            Sign Up Instead
        </Button>
        </form>
    </>

    ):(
    <>
        <Typography variant='h5'>Sign Up</Typography>
        <form style={{
            width:"100%",
            margin:'1rem',

        }}
        onSubmit={handleSignUp}
        >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar
                sx={{
                    width:"10rem",
                    height:"10rem",
                    objectFit:"contain"
                }}
                src={avatar.preview}
                />
                <IconButton 
                sx={{
                    position:"absolute",
                    bottom:"0",
                    right:"0",
                    color:"white",
                    bgcolor:"rgba(0,0,0,0.5)",
                    ":hover":{
                        bgcolor:"rbga(0,0,0,0.7)",
                    },

                }}
                component="label"
                >
                    <>
                    <CameraAltIcon/>
                   <VisuallyHiddenInput type='file'onChange={avatar.changeHandler}/>
                        
                   
                    </>
                </IconButton>
            
                </Stack>
                 {
                avatar.error &&(
                    <Typography m={"1rem auto "}width={'fit-content'}display={"black"} color='error' variant='caption'>
                        {avatar.error}
                    </Typography>
                )
             }

            <TextField 
            required
             fullWidth 
             label="Name"
             margin='normal'
             variant='outlined'
             value={name.value}
             onChange={name.changeHandler}
             />
             <TextField 
            required
             fullWidth 
             label="Bio"
             margin='normal'
             variant='outlined'
              value={bio.value}
              onChange={bio.changeHandler}
             />
            <TextField 
            required
             fullWidth 
             label="Username"
             margin='normal'
             variant='outlined'
             value={username.value}
              onChange={username.changeHandler}
             />
             {
                username.error &&(
                    <Typography color='error' variant='caption'>
                        {username.error}
                    </Typography>
                )
             }
             <TextField 
            required
             fullWidth 
             label="Password"
             type='password'
             margin='normal'
             variant='outlined'
             value={password.value}
              onChange={password.changeHandler}
             />
            

        <Button 
        sx={{
            
        }}
        fullWidth
        variant='contained'
        color='primary'
        type='submit'
        >
            Sign Up
        </Button>
        <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
        <Button
        
        fullWidth
        variant='text'
       
        onClick={toggleLogin}
        >
            Login Instead
        </Button>
        </form>
    </>)
}
        </Paper>
    </Container>
     </div>
  )
}

export default Login
