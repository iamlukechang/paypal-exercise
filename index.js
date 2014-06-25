var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var PORT = 8080;

// connect to mongodb
mongoose.connect('mongodb://localhost/paypalexercise');
var db = mongoose.connection;
db.once('open', function () {
  console.log('Mongodb is ready...');
});

// make a new model constructor
var Transaction = mongoose.model('Transaction', {
  email: String,
  currency: String,
  amount: Number,
  message: String,
  purpose: String,
  date: String
});

// express app configuration
var app = express();
app.use(bodyParser());
app.use('/', express.static(process.cwd() + '/www/'))

// save a new row
app.post('/save', function (req, res) {
  var date = new Date();
  req.body.date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
  new Transaction(req.body).save(function (err) {
    if (err) throw err;
    res.send({
      email: req.body.email,
      amount: req.body.amount,
      currency: req.body.currency
    });
  });
});

// read all data
app.get('/read', function (req, res) {
  Transaction.find(function (err, data) {
    // make response cacheable if needed
    //res.set('Cache-Control', 'max-age=3600');
    res.send(data);
  });
});

// server listening
app.listen(PORT, function () {
  console.log('Server is listening on port ' + PORT + '...');
});
