//file to CONNECT different modules in to our project
const express = require('express');
var cors = require('cors');

const connection = require('./connection');

const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billRoute = require('./routes/bill');
const dashboardRoute = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));     //whenvere we pass a value in url we r going to get it from here
app.use(express.json());

app.use('/user',userRoute); 
app.use('/category',categoryRoute); 
app.use('/product',productRoute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardRoute);

module.exports = app;