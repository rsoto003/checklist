const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model
require('../models/User');

const User = mongoose.model('users')

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login Form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/items',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form POST
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords do not match'});
    } 
    if(req.body.password < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0 ){
        res.render('users/register', {
            errors: errors, 
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({email: req.body.email}).then(user=> {
            if(user){
                req.flash('errorMessage', 'Email is already registered.');
                res.redirect('/users/register');
            } else {
                const newUser =  new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                })
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err) throw err;
                        newUser.password = hash;
                        console.log('newUser.password: ' + newUser.password)
                        console.log(newUser);
                        newUser.save()
                            .then(user => {
                                req.flash('successMessage', 'You are now registered. You may now log in.');
                                res.redirect('/users/login');
                            }).catch(err => {
                                console.log(err)
                                return;
                            })
                    })
                });              
            }
        })
    }
});

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successMessage', 'You are logged out.');
    res.redirect('/users/login');
})


module.exports = router;