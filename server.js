// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var request = require('request');
var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var cheerio = require("cheerio");

var url = "url";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5555;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); 
});

router.route('/bears')
    .post(function(req, res) {
        
        var bear = new Bear();     
        bear.name = req.body.name; 

        
        bear.save(function(err) {
            if (err)
                res.send(err);

            console.log('name: '+ req.body.name);
            res.json({ message: 'Bear created!' });
        });
        
    })     
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

//scrap 
router.get('/cruises',function(req,res){
    console.log("cruises");    
    
    request(url,function(error,response,body){

        if(!error){
            var $ = cheerio.load(body);
            var titulo = $("title").text();
            console.log("titulo: " + titulo);
        }
    });

    res.json({message:'scarping cruises is starting'});
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

var Bear = require('./app/models/bear');
