const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   
    name: String,
  lastName: String,
  mobileNo: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },

  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
const userModel = mongoose.model("user",userSchema)
module.exports ={userModel}