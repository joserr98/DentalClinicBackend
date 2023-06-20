import mongoose from "mongoose";

const Treatment = mongoose.model('Treatment', new mongoose.Schema({
    treatment:{
        type:String,
        required:true
    },
    duration: Number,
    price: Number,
    created_at:Date,
    deleted_at:Date

},{versionKey:false}))

export default Treatment