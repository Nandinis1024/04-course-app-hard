const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const users = require('./routes/users');
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

// Initialize Express app
const app = express();
const port = 3000;

// Set up middleware to parse JSON and URL-encoded data
app.use(cookieParser());
app.engine('ejs', ejsMate)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/course-app',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error")); // Log database connection errors
db.once("open",()=> {
    console.log("Database connected successfully"); // Log successful database connection
    });

// ... (Routes for admin signup, login, course management)
  app.use("/admin", admin);
// ... (Routes for user signup, login, course selection, etc.)  
  app.use("/users", users);


//Error handling
app.all("*",(req, res, next)=>{
  next(new ExpressError("page not found", 404))
})


app.use((err, req, res, next)=>{
  const { statusCode = 500 }= err;
  if(!err.message) err.message = "oh boy! something went wrong";
  res.status(statusCode).send(err.message);
})


// Start the Express server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
