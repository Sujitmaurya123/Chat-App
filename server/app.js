import express from "express";

import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'


dotenv.config({
    path:"./.env",
})
const mongoURI =process.env.MONGO_URI;
const port =process.env.PORT||3000
connectDB(mongoURI);

// createUser(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("6651d2176006be44d35d5a96",50)

const app=express();

// Using Middlewares Here
app.use(express.json());
// app.use(express.urlencoded());
app.use(cookieParser());

app.use("/user",userRoute)
app.use("/chat", chatRoute)


app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use(errorMiddleware);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

})
