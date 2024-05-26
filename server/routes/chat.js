import express from "express";


import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup,
     newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {  addMemberValidator, chatIdValidator,
      newGroupValidator, removeMemberValidator, renameValidator,
       sendAttachmentsValidator, validateHandle } from "../lib/validators.js";

const app=express.Router();


// After here user must be Logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupValidator(),validateHandle,newGroupChat);

app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMemberValidator(),validateHandle,addMembers);

app.put("/removemember",removeMemberValidator(),validateHandle,removeMember);

app.delete("/leave/:id",chatIdValidator(),validateHandle,leaveGroup);

// Send Attachments

app.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandle,sendAttachments);

// Get Messages
app.get("/message/:id",chatIdValidator(),validateHandle,getMessages)
// Get Chat Details ,rename,delete

app.route("/:id").get(getChatDetails,chatIdValidator(),validateHandle)
.put(renameGroup,renameValidator(),validateHandle)
.delete(deleteChat,chatIdValidator(),validateHandle);



export default app;