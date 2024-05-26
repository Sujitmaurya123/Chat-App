import express from "express";
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser,
     searchUser, sendFriendRequest } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator,
     registerValidator ,sendRequestValidator,validateHandle} from "../lib/validators.js";


const app=express.Router();
app.post("/new", singleAvatar, registerValidator(), validateHandle,newUser)
app.post("/login",loginValidator(),validateHandle,login)

// After here user must be Logged in to access the routes
app.use(isAuthenticated);
app.get("/me",getMyProfile);
app.get("/logout", logout);

app.get("/search",searchUser);
app.put("/sendrequest",sendRequestValidator(),validateHandle, sendFriendRequest);

app.put("/acceptrequest", acceptRequestValidator(), validateHandle, acceptFriendRequest);

app.get("/notifications", getMyNotifications);

app.get("/friends",getMyFriends);


export default app; 