const model = require('../models/user');
//const office=require('../models/office');
const bookedAppointment=require('../models/bookedAppointment');

exports.new = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
let user = new model(req.body);
if(user.email){
    user.email=user.email.toLowerCase();
}
user.save()
.then(user=> {
    req.flash('success', 'You have registered successfully');
    res.redirect('/users/login');
})
.catch(err=>{
    if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);  
        return res.redirect('/users/new');
    }

    if(err.code === 11000) {
        req.flash('error', 'This email address has already been used');  
        return res.redirect('back');
    }
    next(err);
}); 

};

exports.getLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
let email = req.body.email;
if(email){
    email=email.toLowerCase();
}
let password = req.body.password;
model.findOne({ email: email })
.then(user => {
    if (!user) {
        req.flash('error', 'Incorrect email address');  
        res.redirect('/users/login');
        } else {
        user.comparePassword(password)
        .then(result=>{
            if(result) {
                req.session.user = user._id;
                req.session.username = user.firstName+' '+user.lastName;
                req.session.isAdmin=false;
                req.flash('success', 'You have logged in successfully');
                res.redirect('/');
        } else {
            req.flash('error', 'Incorrect password');      
            res.redirect('/users/login');
        }
        });     
    }     
})
.catch(err => next(err));
};

exports.logout = (req, res, next)=>{
req.session.destroy(err=>{
    if(err) 
       return next(err);
   else{
       res.redirect('/');
   }  
});

};

exports.profile=(req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id),bookedAppointment.find({user:id}).populate('office','name')])
    .then(results=>{
        const [user,appointments]=results;
        res.render('./user/profile',{user,appointments});
    })
    .catch(err=>next(err));
};