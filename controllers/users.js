const express = require('express'); // Load environment variables from a .env file
const bodyParser = require('body-parser');
const Admin = require("../models/admin");
const Course = require("../models/course");
const User = require("../models/user");
const { generateJwt } = require("../auth");
const { userSchema } = require("../schemas");

const app = express();

// Set up middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


module.exports.createUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const ifUser = await User.findOne({username: username});
    if(!ifUser){
      const newUser = new User({username: username, password: password});
      await newUser.save();
      const token = await generateJwt(username);
      res.json({ message: 'User registered successfully', token });
  
    }
    else{
      res.json({message:"User Already exists"});
    }
  }



  module.exports.loginUser = async (req, res) => {
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
  }



  module.exports.viewCourses = async (req, res) => {
    const courses = await Course.find({});
    res.json({courses});
  }




 module.exports.buyCourse = async (req, res) => {
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
  }


  

  module.exports.viewPurchase = async (req, res) => {
    //console.log(req.user);
    const user = await User.findOne({username: req.user.username}).populate('courses');
    console.log(user);
    if(user){
      res.json({courses: user.courses});
    }
    else{
      res.json({error:'User not found'});
    }
  }