const express=require('express');
const router=express.Router();
const controller=require('../controllers/officeController');
const auth=require('../middlewares/auth');
const validator=require('../middlewares/validator');

//GET /offices: View all Offices
router.get('/',controller.index);

//GET /offices/new: HTML form to add new office
router.get('/new',auth.isAdminLoggedIn,controller.new);

//POST /offices: Adds new office
router.post('/',auth.isAdminLoggedIn,controller.create);

//GET /offices/:id: View the office with given ID
router.get('/:id',validator.validateId,controller.show);

//GET /offices/:id/edit: HTML form to edit the office with given ID
router.get('/:id/edit',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.edit);

//PUT /offices/:id: Update the office with given ID
router.put('/:id',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.update);

//DELETE /offices/:id: Delete the office with given ID
router.delete('/:id',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.delete);

//GET /offices/:id: Get scheduled appointments for the office with given ID
router.get('/:id/appointments',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.appointments);

//GET /offices/:id/addAppointments: HTML Form to add appointments for the office with given ID
router.get('/:id/addAppointments',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.addAppointments);

//POST /offices/:id/addAppointments: Adds appointments for the office with given ID
router.post('/:id/addAppointments',validator.validateId,auth.isAdminLoggedIn,auth.isAdmin,controller.createAppointments);

//GET /offices/:id/schedule: Get appointments for the office with given ID
router.get('/:id/schedule',validator.validateId,auth.isUserLoggedIn,controller.getSchedule);

//POST /offices/:id/schedule: Schedule appointment for the office with given ID
router.post('/:id/schedule',validator.validateId,auth.isUserLoggedIn,controller.schedule);

//DELETE /offices/:id/cancel: Cancel the appointment for the office with given ID
router.delete('/:id/cancel',validator.validateId,auth.isUserLoggedIn,controller.cancelSchedule);

module.exports=router;