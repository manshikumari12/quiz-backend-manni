const jwt = require('jsonwebtoken');
require("dotenv").config();
const userAuthMiddleware = async (socket,  next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error('Authentication failed. No token provided.'));
       
    }
    jwt.verify(token,      process.env.JWT_TOKEN, (err, decoded) => {
     console.log(process.env.JWT_TOKEN);

        if (err) {
            socket.emit('authenticationFailed', { message: 'Invalid token' });
            return next(new Error('Authentication failed. Invalid token.'));
        }
       
      
          socket.user = decoded.name;
        socket.email = decoded.email;
        // console.log(socket.email)

        // socket.user = decoded.email;
        // console.log(socket.email)
        // console.log(decoded.email)
        // console.log(socket.user)
        //  console.log( decoded.name)
        //    console.log('User authenticated:', socket.user);
        next();
    });
};

module.exports = { userAuthMiddleware };