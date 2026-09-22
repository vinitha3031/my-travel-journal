import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose'
import url, { fileURLToPath } from "url"
import path from "path"
import {User} from './mongoose/UserSchema.js'
import { travel } from './mongoose/travelSchema.js';
import passport from 'passport';
import session from "express-session";
import './passport.js';
import bcrypt from 'bcrypt'

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost/express')
.then(()=>console.log('DB connected'))
.catch((error)=>console.log(`Error:${error}`))

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
    if (!req.isAuthenticated()) {
    return res.redirect("/login");
}
    res.sendFile("routes/index.html",{root:__dirname})
})

app.get('/login',(req,res)=>{
    res.sendFile("routes/login.html",{root:__dirname})
})

app.get('/signup',(req,res)=>{
    res.sendFile("routes/signup.html",{root:__dirname})
})

app.post('/signup',async (req,res)=>{ 
    try{
        let password=await bcrypt.hash(req.body.password, 10)

        let user=await User.create({...req.body, password})
        res.status(200).json({success:true,user})
    }
    catch(err){
        if (err.code === 11000) {
        res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
})


app.post("/login", (req, res, next) => {
    passport.authenticate('local',(err,user,info)=>{
        if(err) return next(err);
        if(!user){
            return res.status(401).json({
                success: false,
                message: info?.message || "Login failed"
            })
        }
        req.logIn(user,(err)=>{
            if(err) return next(err);
            return res.json({success:true,message:'Login Successful',user});
            
        });
    })(req,res,next);

});

app.post('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return res.status(500).json({message:'Logout failed'});

        }
        return res.json({success:true,message:'Logout Successful'});

    })
    
})


app.post('/api/addtravel', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({success:false})
    }

    if(req.body.city && req.body.desc){
        try{
            let newtravel = await travel.create({
        ...req.body,
        email: req.user.email
        })
            res.status(200).json({success:true, newtravel})
        }
        catch(err){
             res.status(500).json({success:false,err})
        }
       
    }

    else{
        res.status(400).json({success:false,message:'City and Description must not be empty'})
    }

 
    
})

app.post('/api/gettravel',async(req,res)=>{
   
    if(!req.isAuthenticated()){
        return res.status(200).json({success:false})
    } 
    let search=req.body.search
    let travels;

    if(search){
        try{
            travels=await travel.find({email:req.user.email,
            city:{$regex:search,$options:'i'}})
        }
        catch(err){
            return res.status(400).json({success:false,err})
        }
        
    }
    else{
        try{
            travels=await travel.find({email:req.user.email})
        }
        catch(err){
            return res.status(500).json({success:false,err})
        }
        
    }
    res.status(200).json({success:true,travels,name: req.user.Fname})
})

app.post('/api/updatetravel/:id',async(req,res)=>{
     if(req.isAuthenticated()){

        let resp=await travel.findOne({
            _id:req.params.id,
            email:req.user.email
        })
        if(!resp){
            return res.status(403).json({success:false})
        }
        if(req.body.city && req.body.desc){
            try{
                await travel.findByIdAndUpdate(req.params.id, req.body);
                res.status(200).json({success:true})
            }
            catch(err){
                res.status(500).json({success:false,err})  
            }
            
        }
        else{
            res.status(400).json({success:false,message:'City and Description must not be empty'})
        }
  
    }
    else {
    return res.status(401).json({ success: false });
}
    
    
})

app.post('/api/deletetravel/:id',async(req,res)=>{
    if(req.isAuthenticated()){

        let resp=await travel.findOne({
            _id:req.params.id,
            email:req.user.email
        })

        if(!resp){
            return res.status(403).json({success:false})
        }
        try{
             await travel.findByIdAndDelete(req.params.id);
            res.status(200).json({success:true})
        }
        catch(err){
            res.status(500).json({success:false,err})
        }
       
    }
    else {
    return res.status(401).json({ success: false });
}
    
    
})

app.listen(3000,()=>{
    console.log("App is running on port 3000...")
})