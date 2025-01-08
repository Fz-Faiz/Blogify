const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { title } = require('process');
const Blog = require('../models/blog');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName =`./public/uploads/${req.user.id}`;

        fs.mkdirSync(folderName,{recursive:true});
    
      cb(null, path.resolve(folderName))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
      
        cb(null, fileName )
    }
  })
  
const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    });
})

router.post("/",upload.single("coverImage"),async (req,res)=>{
    const  {title,body} = req.body;
    const blog  = await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.user.id}/${req.file.filename}`,
        createdBy:req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;