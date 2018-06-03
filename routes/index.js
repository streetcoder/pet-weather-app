var express = require('express');
var router = express.Router();
var request = require("request");
var env = require('dotenv').config();
var mcache = require('memory-cache');

if (process.env.NODE_ENV === 'dev') {
    var api_base = 'http://localhost:8080';
}else{
    var api_base = 'https://api-pet-shelter.herokuapp.com';
}

var endpoint = '/api/pets';

var cache = function(duration) {
    return function (req, res, next) {
        var key = '__express__' + req.originalUrl || req.url;
        var cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return
        } else {
            res.sendResponse = res.send;
            res.send = function(body){
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            };
            next()
        }
    }
};

// call API to display the all pets
router.get('/', cache(10),function(req, res, next) {

    request.get(api_base + endpoint, function (error, response, body) {
        var api_res = JSON.parse(body);

        if(api_res.status == 'error')
            req.flash('error', api_res.message);
        res.render('index', { data: JSON.parse(body), title: 'Welcome to Pet Weather App' });
    });

});


module.exports = router;
