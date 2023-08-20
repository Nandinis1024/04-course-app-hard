const express = require("express");
const router = express.Router();
const { authenticateJwt, validateAdmin, validateCourse } = require("../middleware");
const admin = require("../controllers/admin");




//routes
router.post('/signup', validateAdmin, admin.createAdmin);
  
router.post('/login', admin.loginAdmin);

router.route('/courses')
    .get(admin.viewCourses)
    .post(authenticateJwt, validateCourse, admin.createCourses)

  
router.put('/courses/:courseId', authenticateJwt, validateCourse, admin.editCourse);
  

  



module.exports = router;