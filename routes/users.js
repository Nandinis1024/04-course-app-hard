const express = require("express");
const router = express.Router();
const { authenticateJwt } = require("../middleware");
const users = require("../controllers/users");





//routes
router.post('/signup', users.createUser);
  
  router.post('/login', users.loginUser);
  
  router.get('/courses', authenticateJwt, users.viewCourses);
  
  router.post('/courses/:courseId', authenticateJwt, users.buyCourse);
  
  router.get('/purchasedCourses', authenticateJwt, users.viewPurchase);
  



module.exports = router;