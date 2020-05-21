var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
    mongoose = require('mongoose'),
    Anime = require('./api/models/animeModel')
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/BabylonAnime'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/animeRoutes'); //importing route
routes(app); //register the route

app.listen(port);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

console.log('AnimeAPI started on port ' + port);