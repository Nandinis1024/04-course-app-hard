const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Admin = require("./models/admin");

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


const secretKey = "kittyxoxo12345678";

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

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
