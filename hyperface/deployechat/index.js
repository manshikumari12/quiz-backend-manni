const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./router/user.router");
require("dotenv").config();
const { userAuthMiddleware } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const http = require('http');
const fs = require('fs')
const cors = require('cors')


const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("base point ");
});
app.use("/user", userRouter);






const websocketserver = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
let count =0
const connectedUsers = {};
  websocketserver.use(userAuthMiddleware);

 websocketserver.on("connection", (socket) => {
   count++
     console.log("user connected with id " + socket.id);
 websocketserver.emit("newuser", count); 

    connectedUsers[socket.id] = { name: socket.user, id: socket.id, email: socket.email };


    websocketserver.emit("userList", Object.values(connectedUsers))

    socket.on('disconnect', () => {
        console.log(`User disconnected with ID: ${socket.id}`);
        delete connectedUsers[socket.id];
        websocketserver.emit("userList", Object.values(connectedUsers));
    });

    socket.on('message', ({ sender, recipient, message }) => {
    
        websocketserver.to(recipient).emit('message', { sender, message });
    });

    socket.on("disconnect", () => {
        count--
    websocketserver.emit("newuser", count); 
    });
});



const PORT = 1211;
server.listen(PORT, async () => {
    try {
        await connection;
        console.log("connected to data-base");
    } catch (error) {
        console.log(error);
    }
    console.log(`server is running on port ${PORT}`);
});









