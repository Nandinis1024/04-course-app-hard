// Import required modules and dependencies
require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
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
    const ifUser = User.findOne({username: username});
    if(ifUser){
      res.json({message:"User Already exists"});
    }
    else{
    const newUser = new User({username: username, password: password});
    await newUser.save();
    const token = await generateJwt(username);
    res.json({ message: 'User registered successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const isUser = await User.find({username: username});
    if(isUser){
      const token = await generateJwt(username);
      res.json({message: "User logged in successfully", token});
    }
    else{
      return res.status(401).send('Invalid credentials');
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({});
    res.json({courses});
  });
  
  router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    const id = req.params.courseId;
    const course = await Course.findOne({_id: id});
    //console.log(course);
    //  console.log(req.user.username);
      if(course){
       const user = await User.findOne({username: req.user.username});
      //console.log(user.courses);
      if(user){
        user.courses.push(course);
        await user.save();
        res.json({message:"Course added!"});
      }
      else{
        res.json({error:'User not found'});
      }
    }
    else{
      res.json({message: "Course not found"});
    }
  });
  
  router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    //console.log(req.user);
    const user = await User.findOne({username: req.user.username}).populate('courses');
    console.log(user);
    if(user){
      res.json({courses: user.courses});
    }
    else{
      res.json({error:'User not found'});
    }
  });
  



module.exports = router;