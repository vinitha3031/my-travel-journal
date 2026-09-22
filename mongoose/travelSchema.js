import mongoose from "mongoose";

const travelschema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    image:{
        type:String,
    }

})
export const travel=mongoose.model('travel',travelschema)