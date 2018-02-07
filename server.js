const admin = require('firebase-admin');
const path = require('path');
const cert = require('./db-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(cert),
  databaseURL: `https://${cert.project_id}.firebaseio.com`,
});

const db = admin.database();
var ref = db.ref("/test");

/*
//set data in firebase 
ref.set({
  test1: {
    test2: "data"
	}
});*/
//read data from firebase 
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
  }, function (error) {
    console.log("Error: " + error.code);
});


var express = require('express');
var app = express();
var port = 8080;
app.use(express.static(path.join(__dirname, 'public')))

// start the server
var server = app.listen(port, function() {
  console.log('app started');
  var host = server.address().address
  var port = server.address().port
   
  console.log("Example app listening at http://%s:%s", host, port)
});


// route our app
/*
app.get('/', function(req, res) {
  res.send('hello world! testing?');
});
*/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/create_account', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/signin', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signin.html'));
});

app.get('/input', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/add.html'));
});