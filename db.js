const mongoose =require("mongoose")
require("dotenv").config()
const connection= mongoose.connect("mongodb+srv://manshisbp:manshi@cluster0.ygse9dl.mongodb.net/quiz?retryWrites=true&w=majority")

module.exports={connection}