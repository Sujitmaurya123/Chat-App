import express from "express";
import { login, newUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";

const app=express.Router();
app.post("/new", singleAvatar, newUser)
app.post("/login",login)

// After here user must be Logged in to access the routes


export default app;