

const mongoose=require("mongoose")
const userschema =mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    role:{type:String,default:"User"}
})
const usermodel =mongoose.model("user",userschema)
module.exports={usermodel}