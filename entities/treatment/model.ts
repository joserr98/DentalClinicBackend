import mongoose from "mongoose";

const Treatment = mongoose.model('Treatment', new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    created_at:Date,
    deleted_at:Date

},{versionKey:false}))

export default Treatment