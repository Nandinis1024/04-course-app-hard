const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const users = require('./routes/users');

// Initialize Express app
const app = express();
const port = 3000;

// Set up middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Start the Express server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
