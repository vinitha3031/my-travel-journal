import mongoose from "mongoose";

const userschema=new mongoose.Schema({
    Fname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
})

export const User=mongoose.model('User',userschema)