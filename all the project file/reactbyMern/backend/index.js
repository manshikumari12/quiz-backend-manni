const express = require("express")
const {conncetion}=require("./db")
const {userrouter}=require("./controller.js/user")
const {productrouter}=require("./controller.js/product")
const app=express()
app.use(express.json())

app.use("/user",userrouter)
app.use("/product",productrouter)




app.listen("1111",async()=>{
    try {
conncetion
console.log("connected to database")
        
    } catch (error) {
        console.log(error);
       
        
    }
    console.log("server is running on the port");
})