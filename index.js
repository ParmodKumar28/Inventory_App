// const express = require('express');
import express from 'express';

import ProductsController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';

import ejsLayouts from 'express-ejs-layouts';

import path from 'path';

import validationMiddleware from './middlewares/validation.middleware.js'

import { uploadFile } from './middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from './middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './middlewares/lastVisit.middleware.js';

const app = express();

// Cookies
app.use(cookieParser());
// app.use(setLastVisit);

// Session
app.use(session({
    secret : 'SecretKey',
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false},
}));

// Setup view engine settings
app.set('view engine' , 'ejs');
// Path of our views
app.set("views", path.join(path.resolve(),"src","views"));

// Parse form data
app.use(express.urlencoded({extended: true}));

// Creating middleware for the layouts.
app.use(ejsLayouts);

app.use(express.static('public'));
app.use(express.static('src/views'));



// Creating an instance of ProductController
const productController = new ProductsController();
const usersController = new UserController();
app.get('/',setLastVisit,auth,(productController.getProducts));
app.get('/new',auth,(productController.getAddProduct));
app.post('/',uploadFile.single('imageUrl'),validationMiddleware,(productController.postAddProduct));

app.get('/add-product',auth,productController.getAddProduct);
app.get('/update-product/:id',productController.getUpdateProductView);
app.post('/update-product',productController.postUpdateProduct); 
app.post('/delete-product/:id',productController.deleteProduct);

// Users Requests
app.get('/register',(usersController.getRegister));
app.get('/login',(usersController.getLogin));
app.post('/register',(usersController.postRegister));
app.post('/login',(usersController.postLogin));
app.get('/logout',(usersController.logout));

app.listen('5000',()=>{
    console.log("Server is listening on localhost:5000");
});