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

        if(error) {
            return console.dir(error);
        }

        res.render('index', { data: JSON.parse(body), api_base: api_base, end_point: endpoint });


    });

});



module.exports = router;
