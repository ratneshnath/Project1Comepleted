// let axios = require("axios");
const AuthorModel = require("../authorModel/AuthorModel.js");
const blogsmodel = require("../blogModel/blogModel.js");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    try{
       let data = req.body;
       if(Object.keys(data).length != 0){
       let savedData = await AuthorModel.create(data);
       res.status(201).send({ msg: savedData });
     }
     else res.status(400).send({msg:"bad request"})
    }
    catch(err){
       console.log("this is the error:",err.message)
        res.status(500).send({msg:"Error",error:err.message})
     }
  };

const createBlog = async function (req, res) {
  try {
    let blog = req.body
    let authorId = req.body.authorId
    let author = await AuthorModel.findById(authorId)
    if (!author) {
      return res.status(400).send({ status: false, msg: "No Such Author is Present,Please check authorId" })
    }
    let blogCreated = await blogsmodel.create(blog)
   return res.status(201).send({ status: true, data: blogCreated })
 }
 catch (error) {
    console.log(error)
   return res.status(500).send({ status: false, msg: error.message })
 }
};


const getBlog = async function (req, res) {
  try {
    let qwery = req.query
    let filter = {
        isDeleted: false,     //store the condition in filter variable
        isPublished: true,
        ...qwery
    }
    // console.log(filter)

    const filterByQuery = await blogsmodel.find(filter)  //finding the blog by the condition that is stored in the fiter variable.
    if(filterByQuery.length == 0) {
        return res.status(404).send({status:false, msg:"No blog found"})
    }
    console.log("Data fetched successfully")
    return res.status(201).send({status:true, data:filterByQuery})
}
catch(err) {
console.log(err)
res.status(500).send({status:false, msg: err.message})
}
}



const updateBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = req.body;
    const updateData = await blogsmodel.findById(id)
    if (updateData.isDeleted==true) {
      res.status(404).send({ status: false, msg:err.message})
    }
    data.publishedAt = new Date();
    data.isPublished = true;
    const dataMore = await blogsmodel.findByIdAndUpdate(id, data, { new: true, upsert: true });
    res.status(201).send({ status: true, msg: dataMore })
  } catch (err) {
    res.status(500).send({ status: false, Error:"not match" });
  }
}



const deleteById = async function (req, res) {
  try {
    let blogId = req.params.blogId
    if (!blogId) {
      res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
    }
    let blogDetails = await blogsmodel.findOne({ _id: blogId }, { isDeleted: false })
    if (!blogDetails) {
      res.status(404).send({ status: false, msg: "blog not exist" })
    } else {
      let deleteBlogs = await blogsmodel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt :Date.now} }, { new: true });
         res.status(201).send({ status: true, data: deleteBlogs, msg:"blog deleted " });
      console.log(blogDetails)
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).send({ status: false, msg: error.message })
  }
}


const deleteByQuery = async function (req, res) {
  try {
    let authorIds = req.query.authorId
    let categories = req.query.category
    let tag = req.query.tags
    let subcategories = req.query.subcategory
    if (!authorIds && !categories && !tag && !subcategories) {
      console.log("provide all subs, tags")
      return res.status(400).send({ status: false, msg: "query is required, BAD REQUEST" })
    }
    let authorDetails = await AuthorModel.findById({ _id: authorIds })
    if (!authorDetails) {
      return res.status(404).send({ status: false, msg: "authorId doesn't exist" })
    } else {
      let updatedDetails = await blogsmodel.findOneAndUpdate({$or: [ { authorId: authorIds },{ category: categories }, { tags: { $in: [tag] } }, { subcategory: { $in: [subcategories]}}]},{ isDeleted: true})
      res.status(201).send({data: updatedDetails, msg:"blog deleted "})
      req.body.deletedAt = new Date()
      console.log(updatedDetails)
    }

  }
  catch (error) {
    console.log(error)
    res.status(500).send({status: false, msg: error.message })
  }
}


const loginUser = async function (req, res) {
  try {
     let data = req.body;
     if (Object.entries(data).length == 0) {
        res.status(400).send({ status: false, msg: "kindly pass Some Data" })
     }
     let username = req.body.email;
     let password = req.body.password;
     let user = await AuthorModel.findOne({ email: username, password: password });
     if (!user)
        return res.status(400).send({
           status: false,
           msg: "username or password is not correct",
        });
     let token = jwt.sign({
        userId: user._id,
        email: username
     },
        "first project"
     );
     res.setHeader("x-api-key", token);
     res.status(200).send({ status: true, data: token })

  }
  catch (err) {
     res.status(500).send({ status: false,Error: err.message })
  }
}




module.exports.createAuthor=createAuthor
module.exports.createBlog=createBlog
module.exports.getBlog=getBlog
module.exports.updateBlog=updateBlog
module.exports.deleteById=deleteById
module.exports.deleteByQuery=deleteByQuery
module.exports.loginUser=loginUser