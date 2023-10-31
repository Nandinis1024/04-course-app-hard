// Import required modules and dependencies
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { adminSchema, userSchema, courseSchema } = require("./schemas");

const secretKey = process.env.SECRET_KEY;


// Middleware to authenticate JWT token
module.exports.authenticateJwt = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('No token provided, Forbidden'); // Unauthorized
  }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
      }
      req.user = user;
      next();
    });
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