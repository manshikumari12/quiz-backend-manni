const express=require("express")
const { usermodel } = require("../model/user.model")
const bcrypt =require("bcrypt")
// const jwt =require("jsonwebtoken")
userrouter=express.Router()

userrouter.post("/signup",async(req,res)=>{
const {name,email,password,role}=req.body
try {

    
} catch (error) {
    
}
})


// userrouter.post("/login",(req,res)=>{
    
// })

// userrouter.post("/logout",(req,res)=>{
    
// })

module.exports={userrouter}