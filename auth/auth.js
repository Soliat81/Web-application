const bcrypt = require('bcrypt');
const userDAO = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.grant = (req,res,next) => {

    let username = req.body.username;
    let password = req.body.password;

    userDAO.search(username, (err, user) => {
        if(err){
            return res.status(500).render('login', {
                'errors': [{msg: "An error has occur, pleas try again" }]
            });
        }
        if(!user){
            return res.status(403).render('login', {
                'errors': [{msg: "Invalid credentials" }]
            });
        }
        bcrypt.compare(password, user.Password, (err,out) => {

            if(out){

                let content = {username: user.User};
                let token = jwt.sign(content, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("ticket", token);
                res.locals.user = user.User;
                next();

            }else{
                return res.status(403).render('login', {
                    'errors': [{msg: "Invalid credentials" }]
                });
            }
        })
    })

}

exports.verify_user = (req,res,next) => {
    token = req.cookies.ticket;
    if(!token) {
        res.redirect("/login");
    }else{
        let payload;
        try {
            payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if(payload.username == req.params.user) {
                next();
            }else{
                res.status(401).send("401 - You are not authorized to access this resource");
            }
        } catch (err) {
            res.status(401).send("401 - You are not authorized to access this resource");
        }
    }
}

exports.verify = (req,res,next) => {
    token = req.cookies.ticket;
    if(!token) {
        res.redirect("/login");
    }else{
        let payload;
        try {
            payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            res.locals.user = payload.username;
            next();
        } catch (err) {
            res.status(401).send("401 - You are not authorized to access this resource");
        }
    }
}