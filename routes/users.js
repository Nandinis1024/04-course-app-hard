const express = require("express");
const router = express.Router();
const { authenticateJwt, validateUser } = require("../middleware");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");





//routes
router.post('/signup', validateUser, catchAsync(users.createUser));
  
  router.post('/login', validateUser, catchAsync(users.loginUser));
  
  router.get('/courses', authenticateJwt, catchAsync(users.viewCourses));
  
  router.post('/courses/:courseId', authenticateJwt, catchAsync(users.buyCourse));
  
  router.get('/purchasedCourses', authenticateJwt, catchAsync(users.viewPurchase));
  



module.exports = router;