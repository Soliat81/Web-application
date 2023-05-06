const express = require('express');
const app = express();

const path= require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

app.use("/css",express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const cookieParser= require('cookie-parser');
app.use(cookieParser());

const mustache = require("mustache-express");
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/routeList');
app.use("/",router);

app.listen(3000, () => {console.log("Server started on local host 3000")});