// Import required modules and dependencies
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { adminSchema, userSchema, courseSchema } = require("./schemas");

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





  module.exports.validateAdmin = (req, res, next) => {
    const { error } = adminSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        res.send(msg);
    } else {
        next();
    }
}


module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      res.send(msg);
  } else {
      next();
  }
}

module.exports.validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      res.send(msg);
  } else {
      next();
  }
}