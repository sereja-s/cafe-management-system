const { json } = require('express');
const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//API: to add new category in our database
router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    query = "insert into category (name) values(?)"
    connection.query(query,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Category Added Successfully"}); 
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to get all category records
//this API will be used by normal user as well as admin, i.e. why we are not checking roles
router.get('/get',auth.authenticateToken,(req,res,next)=>{
    //here we are not expecting any input from user(or body)
    var query = "select *from category order by name";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to update any record
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query,[product.name,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){      //checking if any Row has been updated after running the query
                return res.status(404).json({message:"Catergory id is not found"});
            }
            return res.status(200).json({message:"Category Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;