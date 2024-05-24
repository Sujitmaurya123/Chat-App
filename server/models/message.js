import mongoose, { Schema, model } from "mongoose";

const schema=new Schema({
    content:String,

    attachments:[
        {
        public_id: {
            type: String,
            required: true,

        },
        url: {
            type: String,
            required: true,
        },
    },
    ],
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required:ture,

    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: ture,
    },
},{
    timestamps:true,
});



export const Message=mongoose.models.Message||model("Message",schema);