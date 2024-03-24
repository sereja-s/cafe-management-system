//file containing APIs which will use the report.ejs file
const express = require('express');
const connection = require('../connection');
const router = express.Router();

let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');

var auth = require('../services/authentication');


//API: to generate the report pdf
router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();    //a time based uuid version 
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);         //to remove slashes

    //storing data in DB
    var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            /*  whenever we want to create/render the file we have to pass all the details we want to be changed during runtime  */
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//API: to get the pdf to frontend,  frontend gives a uuid, we'll use this uuid. If PFD already exist, return it. Or else
//create the PDF and return it. That's why it is a post method
router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    //if pdf already exist return that pdf
    if (fs.existsSync(pdfPath)) {     //ref 3)
        res.contentType("application/pdf");     //ref 1)
        fs.createReadStream(pdfPath).pipe(res);   //ref 2)
    }
    else {
        //deseralise the product => create a new pdf for us, and return 
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

//API: to get all the bills
router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    var query = "select *from bill order by id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//API: to delete the bill
router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from bill where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Bill ID is not found." });
            }
            return res.status(200).json({ message: "Bill Deleted Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    })
}) 

module.exports = router;

/*
1)The Content-Type representation header is used to indicate the original media type of the resource (prior to any content encoding applied for sending).
    In responses, a Content-Type header provides the client with the actual content type of the returned content
 
 2) The createReadStream() method is an inbuilt application programming interface of fs module 
    which allow you to open up a file/stream and read the data present in it.

    pipe- The readable.pipe() method attaches a Writable stream to the readable , causing it to switch automatically into flowing mode 

 3)The fs.existsSync() method is used to synchronously check if a file already exists in the given path or not. 
    It returns a boolean value which indicates the presence of a file.
    */