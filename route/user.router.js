const express=require("express")
const {usermodel}=require("../model/user.model")
const jwt = require("jsonwebtoken");

require("dotenv").config();
const {blackmodel} = require("../model/black.model");
const bcrypt = require("bcrypt");
// const argon2 = require('argon2');
const userroute=express.Router()


userroute.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
  
    // Regular expression to validate password
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
  
    try {
      const user = await usermodel.findOne({ email });
      if (!user) {
        if (passwordRegex.test(password)) {
          bcrypt.hash(password, 5, async (err, hash) => {
            const newUser = new usermodel({ name, email, password: hash });
            await newUser.save();
            res.status(200).send({ message: "Registration successful" });
          });
        } else {
          res
            .status(400)
            .send({
              message:
                "Password should have a minimum length of 8 and contain at least one uppercase letter, one symbol, and one number",
            });
        }
      } else {
        res.status(400).send({ message: "There’s already an account with that email" });
      }
    } catch (error) {
      console.log(error.message)
      res.status(400).send({ message: error.message });
    }
  });
  
 

userroute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usermodel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, process.env.TOKENKEY, { expiresIn: "7d" });
                    const refreshToken = jwt.sign({ userID: user[0]._id }, process.env.REFRESHTOKENKEY, { expiresIn: "28d" });

                    res.send({ msg: "User has been logged in", token: token, userID: user[0]._id, user });
                } else {
                    res.send({ msg: "Wrong credentials" });
                }
            });
        } else {
            res.send({ msg: "Wrong credentials" });
        }
    } catch (error) {
        res.send({ msg: "Something went wrong", error: error.message });
    }
});

 

 




  userroute.get("/logout", async (req, res) => {
    let token = req.headers.authorization?.split(" ")[1];
    let black = new blackmodel({ token });
    await black.save();
    res.send({ msg: "logout sucessfully!!" });
  });
  


module.exports={userroute}