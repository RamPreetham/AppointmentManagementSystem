const model = require('../models/admin');


exports.new = (req, res)=>{
    return res.render('./admin/new');
};

exports.create = (req, res, next)=>{
let admin = new model(req.body);
if(admin.email){
    admin.email=admin.email.toLowerCase();
}
admin.save()
.then(admin=> {
    req.flash('success', 'You have registered successfully');
    res.redirect('/admins/login');
})
.catch(err=>{
    if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);  
        return res.redirect('/admins/new');
    }

    if(err.code === 11000) {
        req.flash('error', 'This email address has already been used');  
        return res.redirect('back');
    }
    next(err);
}); 

};

exports.getLogin = (req, res, next) => {
    return res.render('./admin/login');
}

exports.login = (req, res, next)=>{
let email = req.body.email;
if(email){
    email=email.toLowerCase();
}
let password = req.body.password;
model.findOne({ email: email })
.then(admin => {
    if (!admin) {
        req.flash('error', 'Incorrect email address');  
        res.redirect('/admins/login');
        } else {
        admin.comparePassword(password)
        .then(result=>{
            if(result) {
                req.session.user = admin._id;
                req.session.username = admin.firstName+' '+admin.lastName;
                req.session.isAdmin=true;
                req.flash('success', 'You have logged in successfully');
                res.redirect('/');
        } else {
            req.flash('error', 'Incorrect password');      
            res.redirect('/admins/login');
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