// Import required modules and dependencies
require('dotenv').config();
const express = require('express'); // Load environment variables from a .env file
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Admin = require("../models/admin");
const Course = require("../models/course");
const User = require("../models/user");

const app = express();

// Set up middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Load the secret key for JWT from environment variables
const secretKey = process.env.SECRET_KEY;

// Function to generate a JWT token for a user
const generateJwt = (user) => {
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

// Middleware to authenticate JWT token
const authenticateJwt = (req, res, next) => {
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

//routes
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username == process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD) {
      const ifAdmin = await Admin.findOne({username: username, password: password});
      if(!ifAdmin){
      const admin = new Admin({username: username, password: password});
      await admin.save();
        try {
        const token = await generateJwt(username);
        console.log("Admin is successfully registered");
        console.log(token);
      } catch (error) {
        res.sendStatus(500);
      }
    } 
      else{
      console.log('admin already exists');
    }
  }
    else {
      console.log("Eh! these ain't correct credentials to signup as admin bitch. WALK AWAY!!")
      res.sendStatus(403);
    }
  });
  
  
  
  router.post('/login', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const isAdmin = await Admin.findOne({username: username, password: password});
    if(isAdmin){
      const token = await generateJwt(username);
      //console.log(token);
      res.json({ message: 'Logged in successfully', token });
    }
    else{
      res.status(403).json({ message: 'Invalid username or password' });
    } 
  });
  
  router.post('/courses', authenticateJwt ,async (req, res) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json("Course is succesfully created");
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const id = req.params.courseId;
    const course = await Course.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  
    if(course){
      res.json("course updated succesfully");
    }
    else{
      res.json("sorry the course doesnt exist");
    }
  });
  
  router.get('/courses', async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
  });
  



module.exports = router;