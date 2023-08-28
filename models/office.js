const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const officeSchema=new Schema({
    name:{type:String,required:[true,'Name is required']},
    admin:{type: Schema.Types.ObjectId,ref:'Admin'},
    details:{type:String,required:[true,'Details are required']},
    address:{type:String,required:[true,'Address is required']},
    city:{type:String,required:[true,'City name is required']},
    state:{type:String,required:[true,'state name is required']},
    zip:{type:String,required:[true,'Zip code is required']},
    country:{type:String,required:[true,'Country name is required']},
    phone:{type:String,required:[true,'Phone number is required']},
    email:{type:String,required:[true,'Email is required']},
    image:{type:String,required:[true,'Image URL is required']}
});

//Collection will be named as offices in Database
module.exports=mongoose.model('Office',officeSchema);