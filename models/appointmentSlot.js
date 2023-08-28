const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const appointmentSlotSchema=new Schema({
    office:{type:Schema.Types.ObjectId,ref:'Office'},
    date:{type:String,required:[true, 'Date is required']},
    timeSlots:{type:[String],required:[true, 'Time Slots are required']}
});

//Collection will be named as offices in Database
module.exports=mongoose.model('AppointmentSlot',appointmentSlotSchema);