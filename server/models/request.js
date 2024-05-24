import mongoose, { Schema, model,Types } from "mongoose";

const schema=new Schema({
    status: {
        type:String,
        default:"pending",
        enum:["pending",'accepted','rejected'],
    },

    
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: ture,

    },
    receiver: {
        type: Types.ObjectId,
        ref: "Chat",
        required: ture,
    },
},{
    timestamps:true,
});



export const Request=mongoose.models.Request||model("Request",schema);