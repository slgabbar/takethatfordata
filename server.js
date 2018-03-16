const admin = require('firebase-admin');
const path = require('path');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('CPXKNGPIA3','5c48ad9a063387024679616778114894');
var index = client.initIndex('team_players')

index.setSettings({
  searchableAttributes: [
  'name',
  'location',
  'unordered(school)']
})

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

app.param('key1', function(req, res, next, key1) {
    // save name to the request
    req.key1 = key1;
    next();
});
app.param('key2', function(req, res, next, key2) {
    // save name to the request
    req.key2 = key2;
    next();
});
app.param('key3', function(req, res, next, key3) {
    // save name to the request
    req.key3 = key3;
    next();
});
app.param('key4', function(req, res, next, key4) {
    // save name to the request
    req.key4 = key4;
    next();
});
app.param('key5', function(req, res, next, key5) {
    // save name to the request
    req.key5 = key5;
    next();
});
app.param('key6', function(req, res, next, key6) {
    // save name to the request
    req.key6 = key6;
    next();
});
app.param('key7', function(req, res, next, key7) {
    // save name to the request
    req.key7 = key7;
    next();
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

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/about.html'));
});

app.get('/create_account', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/signin', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signin.html'));
});

app.get('/reset', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/reset.html'));
});

app.get('/create_team', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/create.html'));
});

app.get('/create_players', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/addplayers.html'));
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});

app.get('/input', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/add.html'));
});

app.get('/newseason', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/newseason.html'));
});

app.get('/newgame', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/newgame.html'));
});

app.get('/editgame', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/editgame.html'));
});

app.get('/stats', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/playerstat.html'));
});

app.get('/viewstats', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/viewstats.html'));
});

app.get('/viewsearch/:key1/:key2/:key3/:key4', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/viewsearch.html'));
});

app.get('/viewsearch/:key1/:key2/:key3/:key4/:key5/:key6/:key7', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/viewsearch.html'));
});

app.get('/search', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/search.html'));
});

app.get('/account', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/account.html'));
});


