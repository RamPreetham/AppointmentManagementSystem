const model=require('../models/office');
const session = require('express-session');
const appointmentSlot = require('../models/appointmentSlot');
const bookedAppointment = require('../models/bookedAppointment');
const { options } = require('../routes/mainRoutes');

exports.index=(req,res,next)=>{
    model.find()
    .then(offices=>{
        res.render('./office/index',{offices});
    })
    .catch(err=>next(err));
}

exports.new=(req,res)=>{
    res.render('./office/new');
};

exports.create=(req,res,next)=>{
    let office=new model(req.body);
    office.admin=req.session.user;
    console.log(req.session);
    office.save()
    .then(office=>{
        req.flash('success', 'Office has been added successfully');
        res.redirect('/offices');
    })
    .catch(err=>{
        if(err.name==='ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/offices/new');
        }
        next(err);
    });
};

exports.show=(req,res,next)=>{
    let id=req.params.id;
    model.findById(id)
    .then(office=>{
        if(office){
            res.render('./office/show',{office});
        } else{
            let err=new Error('Cannot find the office with ID: '+id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit=(req,res,next)=>{
    let id=req.params.id;
    model.findById(id)
    .then(office=>{
        if(office){
            res.render('./office/edit',{office});
        } else{
            let err=new Error('Cannot find the office with ID: '+id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update=(req,res,next)=>{
    let office=req.body;
    let id=req.params.id;
    model.findByIdAndUpdate(id,office,{useFindAndModify:false, runValidators:true})
    .then(office=>{
        if(office) {
            req.flash('success', 'You have updated the office details successfully');
            return res.redirect('/offices/'+id);
        } else {
            let err = new Error('Cannot find the office with ID: ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name==='ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/offices/'+id+'/edit');
        }
        next(err);
    });
};

exports.delete=(req,res,next)=>{
    let id=req.params.id;
    model.findByIdAndDelete(id,{useFindAndModify:false})
    .then(office=>{
        if(office) {
                req.flash('success', 'You have deleted the office successfully');
                return res.redirect('/offices');
        } else {
            let err = new Error('Cannot find the office with ID: ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.appointments=(req,res,next)=>{
    let id=req.params.id;
    bookedAppointment.find({office:id}).populate('user','firstName lastName')
    .then(bookedAppointments=>{
        console.log(bookedAppointments)
        res.render('./office/appointment/index',{bookedAppointments,id});
    })
    .catch(err=>next(err));
};

exports.addAppointments=(req,res,next)=>{
    let id=req.params.id;
    res.render('./office/appointment/new',{id});
};

exports.createAppointments=(req,res,next)=>{
    let id=req.params.id;
    let slots=req.body;
    console.log(slots);
    function addMinutes(time, minutes) {
        var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
        var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
          ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
          ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
        return tempTime;
    }
    var starttime = slots.open.concat(':00');
    var interval = slots.slot;
    var endtime = slots.close.concat(':00');
    var time = [starttime.slice(0,5)];
    while (starttime < endtime) {  
        starttime = addMinutes(starttime, interval);
        time.push(starttime.slice(0,5));
    }
    time.pop();
    var appointmentSlotLocal= {
        office:id,
        date:slots.date,
        timeSlots:time
    }
    var appSlots=new appointmentSlot(appointmentSlotLocal);
    appSlots.save()
    .then(appSlots=>{
        req.flash('success', 'Slots have been added successfully');
        res.redirect('/offices/'+id+'/appointments');
    })
    .catch(err=>next(err));
};

exports.getSchedule=(req,res,next)=>{
    let id=req.params.id;
    appointmentSlot.find({office:id})
    .then(appointmentSlots=>{
        appointmentSlots.forEach(appointmentSlot => { 
            appointmentSlot.timeSlots=appointmentSlot.timeSlots.sort();
        });
        res.render('./office/appointment/show',{appointmentSlots,id});
    })
    .catch(err=>next(err));
};

exports.schedule=(req,res,next)=>{
    let id=req.params.id;
    let date=req.body.slot.split(',')[0];
    let time=req.body.slot.split(',')[1];
    bookedAppointment.findOneAndUpdate({office:id,user:req.session.user},{date:date,time:time})
    .then(updated=>{
        if(updated){
            Promise.all([appointmentSlot.findOneAndUpdate({office:id,date:date},{$pull:{timeSlots:time}}),appointmentSlot.findOneAndUpdate({office:id,date:date},{$push:{timeSlots:updated.time}})])
            .then(slot=>{
                req.flash('success', 'Appointment has been rescheduled successfully');
                res.redirect('/users/profile');
            })
            .catch(err=>next(err));
        }else{
            var appointment={
                office:id,
                user:req.session.user,
                date:date,
                time:time
            };
            var appointmentBooked=new bookedAppointment(appointment);
            appointmentBooked.save()
            .then(booked=>{
                appointmentSlot.findOneAndUpdate({office:id,date:date},{$pull:{timeSlots:time}})
                .then(slot=>{
                    req.flash('success', 'Appointment has been booked successfully');
                    res.redirect('/users/profile');
                })
                .catch(err=>next(err));
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
};

exports.cancelSchedule=(req,res,next)=>{
    let id=req.params.id;
    let user=req.session.user;
    let date=req.body.slot.split(',')[0];
    let time=req.body.slot.split(',')[1];
    bookedAppointment.findOneAndDelete({office:id,user:user,date:date,time:time})
    .then(appointment=>{
        if(appointment){
            appointmentSlot.findOneAndUpdate({office:id,date:date},{$push:{timeSlots:appointment.time}})
            .then(updated=>{
                req.flash('success', 'Appointment has been cancelled successfully');
                return res.redirect('/users/profile');
            })
            .catch(err=>next(err));
        }
        else{
            let err = new Error('Cannot find appointment for the office with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}