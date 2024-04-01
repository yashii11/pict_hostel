const mongoose=require("mongoose");

const studentSchema=new mongoose.Schema({
    fname: {
        type: String,
        required:true
    },
    lname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    address: {
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    yog: {
        type:Number,
        required:true,
    },
    bloodgroup: {
        type:String,
        required:true,
    },
    registerID: {
        type:String,
        required:true,
        unique:true
    },
    state: {
        type:String,
        required:true
    }
})


const Register= new mongoose.model("Register",studentSchema);

module.exports=Register;