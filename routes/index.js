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

// call API to display the all pets
router.get('/', function(req, res, next) {

    request.get(api_base + endpoint, function (error, response, body) {

        var api_res = JSON.parse(body);

        if(api_res.status == 'error')
            req.flash('error', api_res.message);
        //{ title: 'Express' }
        res.render('index', { data: JSON.parse(body), title: 'Welcome to Pet Weather App' });

    });

});


module.exports = router;
