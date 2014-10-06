var path = require('path')

//Mongoose stuff -- this would really just use existing mongoose models etc
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
testSchema = mongoose.Schema({
        name: String
});
var testModel = mongoose.model('test', testSchema);
/*var testObj = new testModel({ name: 'testobj' });
testObj.save(function (err, testObj) {
      if (err) return console.error(err);
      console.log(testObj);
});*/

var express = require('express');
var app = express();
app.set('views', './views')
app.set('view engine', 'jade')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

//Static files are in the html dir
app.use(express.static(path.join(__dirname, 'html')));

app.get('/data', function(req, res) {
      testModel.find(function (err, testobjs) {
        if (err) return console.error(err);
        res.json(testobjs);
      });
});

app.post('/data', function(req, res) {
    console.log(req.body);
    var inserobj;
    //store data
    for(var i = 0; i < req.body.data.length; i++) {
        insertobj = new testModel(req.body.data[i]);
        //TODO this should really be an upsert
        insertobj.save(function (err, insertobj) {
            if (err) return console.error(err);
            console.log('just saved:');
            console.log(insertobj);
         });
    }
    res.json({a:1});
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

