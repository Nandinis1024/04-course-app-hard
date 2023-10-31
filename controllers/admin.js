const express = require('express'); // Load environment variables from a .env file
const bodyParser = require('body-parser');
const Admin = require("../models/admin");
const Course = require("../models/course");
const User = require("../models/user");
const { generateJwt } = require("../auth");
const { adminSchema } = require("../schemas");


const app = express();

// Set up middleware to parse JSON and URL-encoded data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


module.exports.renderSignup = (req, res) => {
  res.render('createAdmin');
}

module.exports.createAdmin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const ifAdmin = await Admin.findOne({ username: username, password: password });

    if (!ifAdmin) {
      const admin = new Admin({ username: username, password: password });
      await admin.save();

      try {
        const token = await generateJwt(username);
        res.json({ message: "Admin is successfully registered", token });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.json({ message: "Admin already exists" });
    }
  } else {
    res.status(403).json({ message: "Invalid credentials to sign up as admin" });
  }
}


module.exports.renderLogin = (req, res) => {
  res.render('loginAdmin');
}




  module.exports.loginAdmin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = await Admin.findOne({username: username, password: password});

    if(isAdmin){
      const token = await generateJwt(username);
      //console.log(token);
      res.cookie('token', token, { httpOnly: false });
      res.json({ message: 'Logged in successfully', token });
    }
    else{
      res.status(403).json({ message: 'Invalid username or password' });
    } 
  }


module.exports.renderCreateCourses = (req, res) => {
  res.render('createCourse');
}


  module.exports.createCourses = async (req, res) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json("Course is succesfully created");
  }




  module.exports.editCourse = async (req, res) => {
    const id = req.params.courseId;
    const course = await Course.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  
    if(course){
      res.json("course updated succesfully");
    }
    else{
      res.json("sorry the course doesnt exist");
    }
  }


module.exports.renderEditCourse = async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findById({ _id: id });
  res.render('editCourse', { course: course });
}

  module.exports.viewCourses = async (req, res) => {
    const courses = await Course.find({});
    res.render('viewCourse', { courses: courses });
  }



