const express = require("express");
const router = express.Router();
const { authenticateJwt, validateAdmin, validateCourse } = require("../middleware");
const admin = require("../controllers/admin");
const catchAsync = require("../utils/catchAsync");




//routes
router.get('/signup', catchAsync(admin.renderSignup))
router.post('/signup', validateAdmin, catchAsync(admin.createAdmin));


router.get('/login', catchAsync(admin.renderLogin))
router.post('/login', catchAsync(admin.loginAdmin));    
    

router.get('/courses', catchAsync(admin.viewCourses))

router.get('/createCourses', authenticateJwt, catchAsync(admin.renderCreateCourses))
router.post('/createCourses', authenticateJwt, validateCourse, catchAsync(admin.createCourses))

router.get('/courses/:courseId', authenticateJwt, catchAsync(admin.renderEditCourse))  
router.post('/courses/:courseId', authenticateJwt, catchAsync(admin.editCourse));
  

  



module.exports = router;