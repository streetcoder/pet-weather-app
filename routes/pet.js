/**
 * Created by streetcoder on 6/2/18.
 */
var express = require('express');
var router = express.Router();
var request = require("request");
var env = require('dotenv').config();

if (process.env.NODE_ENV === 'dev') {
    var api_base = 'http://localhost:8080';
}else{
    var api_base = 'https://api-pet-shelter.herokuapp.com';
}

var endpoint = '/api/pet';

// display individual pet
router.get('/pet/:petId', function(req, res, next) {

    request.get(api_base + endpoint + '/' + req.params.petId, function (error, response, body) {

        var api_res = JSON.parse(body);

        if(api_res.status == 'error')
            req.flash('error', api_res.message);

        //res.json(api_res);
        res.render('pet', { data: api_res });

    });

});

module.exports = router;
