import express from "express";

import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE,NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";
import cors from "cors";

import {v2 as cloudinary } from 'cloudinary'
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { getSockets } from "./lib/helper.js";

dotenv.config({
    path:"./.env",
})
const mongoURI =process.env.MONGO_URI;
const port =process.env.PORT||3000
  const envMode=process.env.NODE_ENV.trim()||"PRODUCTION";
   const adminSecretKey = process.env.ADMIN_SECRET_KEY || "dcdxcdsfvm knfvfjvn"
const userSocketIDs = new Map(); 

connectDB(mongoURI);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// createUser(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("6651d2176006be44d35d5a96",50)

const app=express();
const server=createServer(app)
const io=new Server(server,{
    cors:corsOptions,
});

// Using Middlewares Here
app.use(express.json());
// app.use(express.urlencoded());
app.use(cookieParser());
// app.use(cors({
//     origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL,],
//     credentials:true,
   
// }));


app.use(cors(corsOptions));


app.use("/api/v1/user",userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin",adminRoute);

app.get("/",(req,res)=>{
    res.send("Hello")
})

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
    );
});

io.on("connection", (socket) => {
    const user = socket.user;
    
    userSocketIDs.set(user._id.toString(), socket.id);
    // console.log(userSocketIDs)
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
            _id: user._id,
            name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
    };
    // console.log("New Message",messageForRealTime)

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

        try {
            await Message.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }
  });

    

    

    socket.on("disconnect",()=>{
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString());
    });

});

app.use(errorMiddleware);

server.listen(port,()=>{
    console.log(`Server is running on port ${port} in ${envMode} Mode`);

})


export {
    envMode,
    adminSecretKey,
    userSocketIDs
};