const admin = require('firebase-admin');
const path = require('path');
const cert = require('./db-credentials.json');

admin.initializeApp(***REMOVED***
  credential: admin.credential.cert(cert),
  databaseURL: `https://$***REMOVED***cert.project_id***REMOVED***.firebaseio.com`,
***REMOVED***);

const db = admin.database();
var ref = db.ref("/test");

/*
//set data in firebase 
ref.set(***REMOVED***
  test1: ***REMOVED***
    test2: "data"
	***REMOVED***
***REMOVED***);*/
//read data from firebase 
ref.once("value", function(snapshot) ***REMOVED***
  console.log(snapshot.val());
  ***REMOVED***, function (error) ***REMOVED***
    console.log("Error: " + error.code);
***REMOVED***);


var express = require('express');
var app = express();
var port = 8080;
app.use(express.static(path.join(__dirname, 'public')))

// start the server
var server = app.listen(port, function() ***REMOVED***
  console.log('app started');
  var host = server.address().address
  var port = server.address().port
   
  console.log("Example app listening at http://%s:%s", host, port)
***REMOVED***);


// route our app
/*
app.get('/', function(req, res) ***REMOVED***
  res.send('hello world! testing?');
***REMOVED***);
*/
app.get('/', function(req, res) ***REMOVED***
    res.sendFile(path.join(__dirname + '/public'));
***REMOVED***);

app.get('/', function(req, res) ***REMOVED***
    res.sendFile(path.join(__dirname + '/public/index.html'));
***REMOVED***);

app.get('/create_account', function(req, res) ***REMOVED***
    res.sendFile(path.join(__dirname + '/public/signup.html'));
***REMOVED***);

app.get('/signin', function(req, res) ***REMOVED***
    res.sendFile(path.join(__dirname + '/public/signin.html'));
***REMOVED***);

app.get('/input', function(req, res) ***REMOVED***
    res.sendFile(path.join(__dirname + '/public/inputdata.html'));
***REMOVED***);