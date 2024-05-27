import express from "express";

import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE,NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";



dotenv.config({
    path:"./.env",
})
const mongoURI =process.env.MONGO_URI;
const port =process.env.PORT||3000
  const envMode=process.env.NODE_ENV.trim()||"PRODUCTION";
   const adminSecretKey = process.env.ADMIN_SECRET_KEY || "dcdxcdsfvm knfvfjvn"
const userSocketIDs = new Map(); 

connectDB(mongoURI);

// createUser(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("6651d2176006be44d35d5a96",50)

const app=express();
const server=createServer(app)
const io=new Server(server,{
    
});

// Using Middlewares Here
app.use(express.json());
// app.use(express.urlencoded());
app.use(cookieParser());

app.use("/user",userRoute);
app.use("/chat", chatRoute);
app.use("/admin",adminRoute);

app.get("/",(req,res)=>{
    res.send("Hello")
})

io.use((socket, next) => {
   
});

io.on("connection", (socket) => {
    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);
    console.log("a user connected", socket.id)
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