
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Admin = require("./models/admin");
const Course = require("./models/course");
const User = require("./models/user");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/course-app',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error"));
db.once("open",()=> {
    console.log("Database connected successfully");
    });


const secretKey = process.env.SECRET_KEY;


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

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};



app.post('/admin/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username == "admin" && password == "pass") {
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




  // logic to sign up admin


app.post('/admin/login', async (req, res) => {
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

app.post('/admin/courses', authenticateJwt ,async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json("Course is succesfully created");
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findByIdAndUpdate({ _id: id }, req.body, { new: true });

  if(course){
    res.json("course updated succesfully");
  }
  else{
    res.json("sorry the course doesnt exist");
  }
});

app.get('/admin/courses', async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// User routes
app.post('/users/signup', async (req, res) => {
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

app.post('/users/login', async (req, res) => {
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

app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({courses});
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
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

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
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

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
