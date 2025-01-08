const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const {connectToMongoDb} = require('./connection');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://127.0.0.1:27017/blogify").then(()=>console.log("MongoDB Connected..."))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get('/', async (req,res)=>{
    const allBlog = await Blog.find();

    res.render("home",{
        user:req.user,
        blogs:allBlog,
    });
})


app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));