var express = require('express');
var router = express.Router();
var request = require("request");
var env = require('dotenv').config();

if (process.env.NODE_ENV === 'dev') {
    var api_base = 'http://localhost:8080';
}else{
    var api_base = 'https://api-pet-shelter.herokuapp.com';
}

var endpoint = '/api/pets';

// display for to add pet
router.get('/add', function(req, res, next) {

    res.render('add');

});

// send form post data to API
router.post('/add', function(req, res, next) {

    request.post(api_base + endpoint,
        {form:
            {name:req.body.name,
             type:req.body.type,
             breed:req.body.breed,
             location:req.body.location,
             latitude: req.body.latitude,
             longitude: req.body.longitude}},
        function(err,httpResponse,body){

        if (err)
            console.log(err)
        res.redirect('/');

    });

});

module.exports = router;
