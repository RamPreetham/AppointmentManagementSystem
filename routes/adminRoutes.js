const express=require('express');
const router=express.Router();
const controller=require('../controllers/adminController');
const auth=require('../middlewares/auth');

//GET /users/login: HTML form for user login
router.get('/login',auth.isGuest,controller.getLogin);

//POST /users/login: Authenticates the user's login
router.post('/login',auth.isGuest,controller.login);

//GET /users/new: HTML form to create new user account
router.get('/new',auth.isGuest,controller.new);

//POST /users: Creates a new user account
router.post('/',auth.isGuest,controller.create);

//GET /users/logout: Logs out the current user
router.get('/logout',auth.isAdminLoggedIn,controller.logout);

module.exports=router;