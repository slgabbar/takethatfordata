//dashboard
var data = [];
var count = 0;


var config = {
    apiKey: "AIzaSyDmi6qgpfnoCZ8a2FM2APfX74dXfiJ9PFY",
    authDomain: "takethatfordata-8f719.firebaseapp.com",
    databaseURL: "https://takethatfordata-8f719.firebaseio.com",
    projectId: "takethatfordata-8f719",
    storageBucket: "takethatfordata-8f719.appspot.com",
    messagingSenderId: "211430446462"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

function setHeader(name, school, loc, season) {
	document.getElementById("team_name").innerHTML = name;
	document.getElementById("school").innerHTML = school;
	document.getElementById("location").innerHTML = loc;
	document.getElementById("active_season").innerHTML = season;
}

firebase.auth().onAuthStateChanged(function(user) {
	var user = firebase.auth().currentUser;
	var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
		var ss = snapshot.val();
		var name = ss.name;
		var school = ss.school;
		var location = ss.location;
		var season = ss.active_season;
		setHeader(name, school, location, season);
	});


});

