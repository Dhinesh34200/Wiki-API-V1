const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const express=require("express");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema=new mongoose.Schema({
    title:String,
    content:String
});

const Article=mongoose.model("Article",articleSchema);

const Insta= new Article({
    title:"Instagram",
    content:"Instagram is social networking platform"
});

// Insta.save();

/////////// Request for all article/////
app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundArticle)=>{
        if(!err){
            res.send(foundArticle);
        }else{
            res.send(err);
        }
       
    });
})
.post((req,res)=>{
    const title=req.body.title;
    const content=req.body.content;
    const article= new Article({
        title:title,
        content:content      
    });
    article.save((err)=>{
        if(!err){
            res.send("Added new article");
        }else{
            res.send(err);
        }
    });
})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err){
            res.send("Deleted all article");
        }else{
            res.send(err);
        }
    });
});

/////////// Request for a specific article/////
app.route("/articles/:titleName")
.get((req,res)=>{
    Article.findOne({title:req.params.titleName},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article found for this article");
        }
        
    });  
})

.put((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.titleName},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},(err)=>{
            if(!err){
                res.send("Updated");
            }else{
                res.send(err);
            }
        });
})

.patch((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.titleName},
        {$set:req.body},
        (err)=>{
            if(!err){
                res.send("updated");
            }else{
                res.send(err);
            }
        })
        
})

.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.titleName},
        (err)=>{
            if(!err){
                res.send("Deleted");
            }else{
                res.send(err);
            }
        });
});



app.listen(3000,()=>{
    console.log("server started on port 3000");
})