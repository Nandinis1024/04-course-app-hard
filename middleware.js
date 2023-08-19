// Import required modules and dependencies
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;


// Middleware to authenticate JWT token
module.exports.authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Extract token from the Authorization header
      const token = authHeader.split(' ')[1];
      // Verify token using the secret key
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden if token is invalid/expired
        }
        req.user = user; // Attach the user data to the request object
        next(); // Move to the next middleware or route handler
      });
    } else {
      res.sendStatus(401); // Unauthorized if no token provided
    }
  };