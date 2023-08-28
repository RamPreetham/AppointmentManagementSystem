const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookedAppointmentSchema=new Schema({
    admin:{type: Schema.Types.ObjectId,ref:'Admin'},
    user:{type:Schema.Types.ObjectId,ref:'User'},
    office:{type:Schema.Types.ObjectId,ref:'Office'},
    date:{type:String,required:[true, 'Date is required']},
    time:{type:String,required:[true, 'Time is required']}
});

//Collection will be named as bookedappointments in Database
module.exports=mongoose.model('BookedAppointment',bookedAppointmentSchema);