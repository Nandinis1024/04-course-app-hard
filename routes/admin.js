const express = require("express");
const router = express.Router();
const { authenticateJwt } = require("../middleware");
const admin = require("../controllers/admin");




//routes
router.post('/signup', admin.createAdmin);
  
router.post('/login', admin.loginAdmin);

router.route('/courses')
    .get(admin.viewCourses)
    .post(authenticateJwt , admin.createCourses)

  
router.put('/courses/:courseId', authenticateJwt, admin.editCourse);
  

  



module.exports = router;