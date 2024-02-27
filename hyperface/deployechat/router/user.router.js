const express = require("express")
const {userModel} = require("../model/user.model")
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

userRouter = express.Router()




userRouter.post("/register", async (req, res) => {
    const { name, lastName, mobileNo, email, address,  password } = req.body;
    if (!email || !password || !name || !lastName  || !mobileNo || !address) {
        return res.status(401).json({ message: 'All fields are required' });
    } else {
        try {
      if (!/^\d{10}$/.test(mobileNo)) {
            return res.status(400).json({ error: "Mobile number must be 10 digits." });
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }


        // Password validation (6 characters, 1 upper case letter, 1 lower case letter, 1 special character)
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}/.test(password)) {
            return res.status(400).json({ error: "Password must be 6 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character." });
        }
            const isUserPresent = await userModel.findOne({ email: email });
            if (isUserPresent) {
                return res.status(409).json({ message: "Email already exists" })
            } else {
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (hash) {
                        let new_user = new userModel({
                            email: email,
                            password: hash,
                            name:name,
                            lastName: lastName,
                            address:address,
                            mobileNo:mobileNo

                        });
                        await new_user.save();
                        return res.status(201).send({ message: 'Registered Successfully',new_user });
                    } else {
                        throw err;
                    }
                });
            }
        } catch (error) {
            return res.status(400).send({ message: "Registration failed" });
        }
    }
});

userRouter.get("/:email",async(req,res)=>{
        const email = req.params.email;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            mobileNo: user.mobileNo,
            address: user.address
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// userRouter.post("/register",async(req,res)=>{
//     const { firstName, lastName, mobileNo, email, address, loginId, password } = req.body;
//     if (!email || !password || !name) {
//         return res.status(401).json({ message: 'All fields are required' });
//     } else {
//         try {
//             const isUserPressent = await userModel.findOne({ email: email });
//             if (isUserPressent) {
//                 return res.status(409).json({ message: "Email already exists" })
//             } else {

//                 bcrypt.hash(password, saltRounds, async (err, hash) => {
//                     if (hash) {
//                         let new_user = new userModel({
//                             email: email,
//                             password: hash,
//                             name: name
//                         });

//                         await new_user.save();
//                         return res.status(201).send({ message: 'Registered Successfully' });
//                     } else {
//                         throw err;
//                     }
//                 });
//             }
//         } catch (error) {
//             return res.status(400).send({ message: "Registered failed" })
//         }
//     }
// })
// userRouter.post("/login",async(req,res)=>{
//    const { email, password,mobileNo,address } = req.body;
//     if (!email || !password) {
//         return res.status(401).json({ message: 'All fields are required' });

//     } else {
//         let isUserPresnt = await userModel.findOne({ email });

//         if (isUserPresnt) {
//             bcrypt.compare(password, isUserPresnt.password, function (err, result) {
//                 if (result) {
//                     const token = jwt.sign({
//                          name: isUserPresnt.name,
//                         email: isUserPresnt.email,
//                         mobileNo: isUserPresnt.mobileNo,
//                         address: isUserPresnt.address }, "manshi", { expiresIn: '24h' }
//                          );
//                     return res.status(200).send({
//                             token: token,
//                         name: isUserPresnt.name,
//                         email: isUserPresnt.email,
//                         mobileNo: isUserPresnt.mobileNo,
//                         address: isUserPresnt.address
//                         });
//                 } else {
//                     return res.status(403).send({ message: 'Invalid Credentials' });
//                 }
//             });
//         } else {
//             return res.status(404).send({ message: 'No user found with this Email' });
//         }
//     }
// })

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: 'All fields are required' });
    } else {
        try {
            let isUserPresent = await userModel.findOne({ email });

            if (isUserPresent) {
                bcrypt.compare(password, isUserPresent.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                            name: isUserPresent.name,
                            email: isUserPresent.email,
                            mobileNo: isUserPresent.mobileNo,
                            address: isUserPresent.address
                        },       process.env.JWT_TOKEN, { expiresIn: '24h' });

                        return res.status(200).send({
                            token: token,
                            name: isUserPresent.name,
                            email: isUserPresent.email,
                             mobileNo: isUserPresent.mobileNo,
                        address: {
                            street: isUserPresent.address.street,
                            city: isUserPresent.address.city,
                            state: isUserPresent.address.state,
                            country: isUserPresent.address.country
                        }
                        });
                    } else {
                        return res.status(403).send({ message: 'Invalid Credentials' });
                    }
                });
            } else {
                return res.status(404).send({ message: 'No user found with this Email' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});

userRouter.get("/data",async(req,res)=>{
  try {
      const users = await  userModel.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
})
module.exports = {userRouter}