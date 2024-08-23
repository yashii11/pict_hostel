const mongoose=require("mongoose");
const validator = require("validator");

const wardenSchema=new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true,
        validator(val)
        {
            if(validator.isEmail(val))
            {
                console.log("correct");
            }
            else{
                console.log("errror ");
            }
        }
    },
    password: {
        type:String,
        required:true
    },

    collegeID: {
        type:String,
        required:true,
        unique:true
    },
    
})


const  warden= new mongoose.model("warden",wardenSchema);

module.exports=warden;