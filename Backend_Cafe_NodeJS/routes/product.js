const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//API: for adding a product
router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Product Added Successfully."});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to get the product records
router.get('/get',auth.authenticateToken,(req,res,next)=>{
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";      //a little bit bigger query (due to inner join)
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to get products by category(we r going to pass the category id, and get all the products connected to that category id)
router.get('/getByCategory/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "select id,name from product where categoryId= ? and status= 'true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: get product by product id
router.get('/getById/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "select id,name,description,price from product where id = ?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results[0]);    //results[0] -> bcoz we need only 1 record, not the complete array
        }
        else{
            res.status(500).json(err);
        }
    })
})

//API: to UPDATE the PRODUCT
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id is not found"});
            }
            return res.status(200).json({message:"Product Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to DELETE a product
router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product Id is not found"});
            }
            return res.status(200).json({message:"Product Deleted Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//API: to change the product status
router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id is not found"});
            }
            return res.status(200).json({message:"Product Status Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;