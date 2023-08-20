const express = require("express");
const router = express.Router();
const { authenticateJwt, validateAdmin, validateCourse } = require("../middleware");
const admin = require("../controllers/admin");
const catchAsync = require("../utils/catchAsync");




//routes
router.post('/signup', validateAdmin, catchAsync(admin.createAdmin));
  
router.post('/login', catchAsync(admin.loginAdmin));

router.route('/courses')
    .get(catchAsync(admin.viewCourses))
    .post(authenticateJwt, validateCourse, catchAsync(admin.createCourses))

  
router.put('/courses/:courseId', authenticateJwt, validateCourse, catchAsync(admin.editCourse));
  

  



module.exports = router;