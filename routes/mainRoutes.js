const express=require('express');
const router=express.Router();
const controller=require('../controllers/mainController');

//GET /: View Home Page
router.get('/',controller.index);

//GET /about: View About Page
router.get('/about',controller.about);

//GET /contact: View Contact Page
router.get('/contact',controller.contact);

module.exports=router;