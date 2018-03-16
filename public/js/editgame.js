 // Initialize Firebase
var db = firebase.database();
displayactgame()
firebase.auth().onAuthStateChanged(function(user) {
//create game list 
  if (user) {
	var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
	  var ss = snapshot.val();
	  var key = snapshot.key;
	  var reff = db.ref("/users/" + user.uid + "/teams/" + key + "/season_" + 
		ss.active_season + "/games/");
	  reff.on("child_added", function(game_snap) {
		var gss = game_snap.val();
		var ele = document.createElement("LI");
		var a = document.createElement("a");
		var v = document.createTextNode(gss.date + " at " + gss.location + " vs " + gss.opponent);
		a.appendChild(v);
		a.href = "#";
		ele.appendChild(a);
		ele.name = game_snap.key;
		ele.onclick = function() {
			var actgameref = db.ref("/users/" + user.uid + "/teams/" + key);
			actgameref.update({"active_game": ele.name});
			displayactgame();
		};
		var gamelist = document.getElementById("gamelist");
		gamelist.appendChild(ele);
		});		
	});
  } else { 
  }
 });
 
function displayactgame() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
	  var ss = snapshot.val();
	  var key = snapshot.key;
	  var season = ss.active_season;
	  var game = ss.active_game;
	  var actgameref = db.ref("/users/" + user.uid + "/teams/" + key + "/season_" +
	    ss.active_season + "/games/" + game);
	  actgameref.once("value", function(snap) {
	    var gamedata = snap.val();
	    var field = document.getElementById("activegame");
		field.innerHTML = "Active Game: " + gamedata.date + " at " + gamedata.location + " vs " + gamedata.opponent
	  });
	});
  }
  });
}
 
function signout(){
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
   window.location = '../'; 
}).catch(function(error) {
  // An error happened.
  console.log("Error: " + error.code);
});
return true;

  }