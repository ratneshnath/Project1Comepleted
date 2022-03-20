const validator = require("validator")
const mongoose = require('mongoose');

const authormodel = new mongoose.Schema( {
    fname: { required:true,
    type:String
},
    lname: { required:true,
    type:String 
},
    title: {
        type:String,
        enum:["Mr", "Mrs", "Miss"],
        required:true
    },
    email: {
        required:true,
        unique:true,
        type:String,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        }
    },
    password:
        { required:true,
        type:String
    }

}, { timestamps: true });   
   
module.exports = mongoose.model('AuthorModel', authormodel)