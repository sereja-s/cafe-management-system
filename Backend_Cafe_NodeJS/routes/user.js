const express = require('express');
const connection = require('../connection'); 
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();              //import env file

var auth = require('../services/authentication');           //services imported
var checkRole = require('../services/checkRole');


//writing a signup API
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Регистрация прошла успешно!" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Такая электронная почта уже существует!!!" });
            }
        }
        else {
            return res.status(500).json(err);
        }

    })
})

//creating a login API
router.post('/login', (req, res) => {
    const user = req.body;                  //gets values from the body
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or Password" });
            }
            //check if the user is approved or not
            else if (results[0].status === 'false') {       //user not approved
                return res.status(401).json({ message: "Wait for Admin Approval" });
            }
            else if (results[0].password == user.password) {
                //to generate the token
                const response = { email: results[0].email, role: results[0].role }     //pass that what we want to insert like, user email address and the role of that particular in JWT token 
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });          //return access token
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//  Creating FORGET PASSWORD API
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword',(req,res)=>{
    const user = req.body;
    query = "select email, password from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <= 0) //  email does not exist in our database
            {
                return res.status(200).json({message:"Password sent successfully to your email."});
            }   // it's a decoy for the Hacker
            else{
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('Email sent: '+info.response);
                    }
                });
                return res.status(200).json({message:"Password sent successfully to your email."});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API to get all the user records
router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    var query ="select id,name,email,contactNumber,status from user where role='user'";  //only returns user records, (not admin)
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to update status of a user(only admin can access this)
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{       //patch - used for making modifications
    let user = req.body;
    var query = "update user set status=? where id=?";  //update status on basis of ID
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){ //means that no row is effected, or no status is changed
                return res.status(404).json({message:"User id does not exist"}); 
            }
            return res.status(200).json({message:"User updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to check the token
router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});
})

//API: to change the password
router.post('/changePassword',auth.authenticateToken,(req,res)=>{
    const user = req.body;
    const email = res.locals.email;     //we'll get the email from token
    var query = "select *from user where email=? and password=?";
    connection.query(query,[email,user.oldPassword],(err,results)=>{
        if(!err){
            if(results.length <=0){
                return res.status(400).json({message:"Incorrect Old Password"});
            }
            else if(results[0].password == user.oldPassword){
                query = "update user set password=? where email=?";
                connection.query(query,[user.newPassword,email],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Password Updated Successfully."});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({message:"Something went wrong. Please try again later"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;