const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require('bcrypt');
const adminSchema=new Schema({
    firstName:{type:String,required:[true, 'First name is required']},
    lastName:{type:String,required:[true, 'Last name is required']},
    email:{type:String,required:[true,'Email address is required'],unique:[true, 'This email address has already been used']},
    password:{type:String,required:[true,'Password is required']}
});

adminSchema.pre('save',function(next){
  let admin=this;
  if(!admin.isModified('password'))
      return next();
  bcrypt.hash(admin.password, 10)
  .then(hash=>{
    admin.password=hash;
    next();
  })
  .catch(err=>next(error));
});


adminSchema.methods.comparePassword=function(inputPassword){
  let admin=this;
  return bcrypt.compare(inputPassword,admin.password);
}

//Collection will be named as admins in Database
module.exports=mongoose.model('Admin',adminSchema);