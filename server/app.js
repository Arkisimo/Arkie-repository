var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var app = express();
var db = mongojs("localhost:27017/confessionDB", ['confessions']);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/confession/all', function (req, res){
    var page = (req.query.page == undefined) ? 0 : parseInt(req.query.page);
    var limit = (req.query.limit == undefined) ? 10 : parseInt(req.query.limit);

    db.confession.find().limit(limit).skip(page * limit).sort({createdAt: -1}).toArray(function(err, docs){
        if (err){
            res.send({status: 200, data: err});
        } else {
            res.send({status: 200, data: docs});
        }
    });
});



app.post('/confession', function (req, res, next){
    var text = req.body.text;
    var name = req.body.name;

    db.confession.insert({
        name: name,
        text: text,
        createdAt: Date.now()
    }, function(err, doc){
        if (err){
            err.status = 403;
            res.send(err);
        } else {
            res.send({status: 200, data: doc});
        }
    });
});

    
    
    


app.listen(8080);