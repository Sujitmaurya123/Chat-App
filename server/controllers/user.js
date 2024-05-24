
import { compare } from 'bcrypt';
import {User} from '../models/user.js'
import { sendToken } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';

// create a new user and save it to the database and save token  in cookie

const newUser=async(req,res,next)=>{

    const {name,username,password,bio}=req.body;

    const avatar={
        public_id:"Sdfsd",
        url:"asdfd",
    }

  const user=  await User.create({
        name,
        bio,
        username,
        password,
        avatar
    });

   sendToken(res,user,201,"User created");
}


// login user and save token in cookie

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Username Or Password",404));
    }
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
        return next(new ErrorHandler("Invalid Username Or Password",404));

    }

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);

})

const getMyProfile =(req,res)=>{};

export {login,newUser,getMyProfile};

