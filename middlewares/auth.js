const office=require('../models/office');


exports.isGuest=(req,res,next)=>{
    if(req.session.user){
        if(req.session.isAdmin){
            req.flash('error','You are logged in already');
            return res.redirect('/offices/');
        }else{
            req.flash('error','You are logged in already');
            return res.redirect('/users/profile');
        }
    }
    return next();
};

exports.isUserLoggedIn=(req,res,next)=>{
    if(req.session.user){
        if(req.session.isAdmin){
            let id=req.params.id;
            req.flash('error','Please Login as User to access');
            return res.redirect('/offices/'+id);
        }
        return next();
    }
    req.flash('error','Please login to access');
    return res.redirect('/users/login');
};

exports.isAdminLoggedIn=(req,res,next)=>{
    if(req.session.user){
        if(req.session.isAdmin){
            return next();
        }
        let err=new Error('Unauthorized to access the resource');
        err.status=401;
        return next(err);
    }
    req.flash('error','Please login to access');
    return res.redirect('/admins/login');
};

exports.isAdmin=(req,res,next)=>{
    let id=req.params.id;
    office.findById(id)
    .then(office=>{
        if(office){
            if(office.admin==req.session.user)
                return next();
            else{
                let err=new Error('Unauthorized to access the resource');
                err.status=401;
                return next(err);
            }
        }else{
            let err = new Error('Cannot find the office with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};