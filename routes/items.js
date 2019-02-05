const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Use helper, using destructuring
const {ensureAuthenticated} = require('../helpers/auth');

//Load Item Model
require('../models/Items');
const Item = mongoose.model('items');

module.exports = router;

//Item Index Route
router.get('/', ensureAuthenticated, (req, res) => {
    Item.find({user: req.user.id})
    .sort({date: -1})
    .then(items => {
        res.render('items/index', {
            items: items
        });
    })
})
//Add Item Form
router.get('/add', ensureAuthenticated, (req,  res)=> {
    res.render('items/add');
});
//Edit Item Form
router.get('/edit/:id', ensureAuthenticated, (req,  res)=> {
    Item.findOne({
        _id: req.params.id,
    }).then(item => {
        if(item.user != req.user.id){
            req.flash('errorMessage', "Not authorized.");
            res.redirect('/items');
        } else {
            res.render('items/edit', {
                item: item
            });
        }
    })   
});

//Process form
router.post('/', ensureAuthenticated, (req, res) => {
    //want to catch what is submitted in the form.
    //use bodyParser
    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Please add a title'});
        // console.log(`There was an error with the title: ${errors}`);
        console.error(errors);
    } 
    if (!req.body.details){
        errors.push({text: 'Please add details!'});
        // console.log(`There was an error with the details form: ${errors}`);
        console.error(errors);
    }
    if(errors.length > 0 ){
        res.render('items/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
        // console.error(JSON.stringify(errors));
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Item(newUser)
            .save()
            .then(item => {
                req.flash('successMessage', 'Checklist Item Sucessfully Added');
                res.redirect('/items')
            })
    }    
})

//Put request-- Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Item.findOne({
        _id: req.params.id
    }).then(item => {
        //new values 
        item.title = req.body.title;
        item.details = req.body.details;

        item.save().then(item => {
            req.flash('successMessage', 'Checklist Item Successfully Updated');
            res.redirect('/items');
        });
    });
});

//Delete Item
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Item.deleteOne({
        _id: req.params.id
    }).then(()=> {
        req.flash('successMessage', 'Checklist Item Sucessfully Removed')
        res.redirect('/items');
        console.log('successfully deleted item');
    })
})