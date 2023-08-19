require('dotenv').config();
const jwt = require('jsonwebtoken');
// Load the secret key for JWT from environment variables
const secretKey = process.env.SECRET_KEY;

// Function to generate a JWT token for a user
module.exports.generateJwt = (user) => {
  const payload = { username: user };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn: '1h' }, function(err, token) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};