/**
 * Created by streetcoder on 6/2/18.
 */
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

var endpoint = '/api/pet';

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

// cloudy sample:
// New York, NY, USA
// display individual pet
router.get('/pet/:petId', cache(10),function(req, res, next) {

    request.get(api_base + endpoint + '/' + req.params.petId, function (error, response, body) {

        var api_res = JSON.parse(body);

        if(api_res.status == 'error'){
            req.flash('error', api_res.message);
        }else{
            request.get('https://api.darksky.net/forecast/53d06189d8f28de6f936c70f85fc7fb9/'+api_res[0].latitude+','+api_res[0].longitude+'', function (error, response, body) {

                var darksky_res = JSON.parse(body);
                var latlng = api_res[0].latitude + ',' + api_res[0].longitude
                if(darksky_res.code == 400) {
                    req.flash('error', darksky_res.error);
                    res.render('pet', { data: api_res, is_umbrella: false });
                }else{
                    var forecast_summary = darksky_res.currently.summary;
                    var is_umbrella = false;
                    var substrings = ['rain','Rain', 'cloud', 'Cloud', 'drizzle', 'Drizzle'],
                        length = substrings.length;
                    while(length--) {
                        if (forecast_summary.indexOf(substrings[length])!=-1) {
                            is_umbrella = true;
                        }
                    }
                    res.render('pet', { data: api_res, is_umbrella: is_umbrella, latlng:latlng, title: 'Know more about it' });
                }

            });
        }

    });

});

module.exports = router;

