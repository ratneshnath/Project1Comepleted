const mongoose = require('mongoose');
const moment = require("moment")
const ObjectId = mongoose.Schema.Types.ObjectId
const blogModel = new mongoose.Schema( {
    title: { 
        required:true,
        type:String
   },
    body: {
     type:String,
     required :true
    },
    authorId: {
        type:ObjectId,
        required:true,
        ref:"AuthorModel"
    },
    tags: { 
        type:[String]
    },
    category: {
        type:[String],
         required:true,
    },
    subcategory: {
        type:[String],
    },
    isDeleted: { 
        type:Boolean,
         default: false 
        },
    delettedAt: {
        type : Date,
        //default : Date.now
    },
    isPublished: {
        type:Boolean,
         default: false },
    publishedAt: {
        type : Date,
        //default : Date.now
    }

}, { timestamps: true });   
   
module.exports = mongoose.model('blogModel', blogModel)