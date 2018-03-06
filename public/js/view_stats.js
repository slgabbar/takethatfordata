 var player_data = []
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


function statsTable(snapshot, game, player) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	var gameref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game);
	if (document.getElementById("statsrow")) {
		document.getElementById("statsrow").remove();
	}
	var tr2 = document.createElement("tr");
	tr2.id = "statsrow";
	gameref.once("value").then(function(snapshot_game){
		var gameval = snapshot_game.val();
		var gameinfo = gameval.date + " vs. " + gameval.opponent;
		var gametd = document.createElement("td");
		var gametext = document.createTextNode(gameinfo);
		gametd.appendChild(gametext);
		tr2.appendChild(gametd);
	});
	ref.once("value").then(function(snapshot_stats) {
		snapshot_stats.forEach(function(child) {
			var tmp = child.key;
			var stats = child.val();
			//var ele;
			if (tmp != "shots") {
				var tds = document.createElement("td");
				var v = document.createTextNode(stats);
				tds.appendChild(v);
				tr2.appendChild(tds);
			}
		});
	});
	//table.appendChild(tr2);
	var tableid = document.getElementById("stats_table");
	tableid.appendChild(tr2);

	var query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/shots/");
	query.once("value").then(function(snapshot_shot) {
		count = 0;
		snapshot_shot.forEach(function(child) {
			var key = child.key;
			var data = child.val();
			playerShotChart(data.count, data.x, data.y, 
				data.shot_made_flag, data.shot_attempted);
		});
	});

}


function teamShotChart() {

}

function playerShotChart(data_count, x, y, make, dist) {
	player_data[count] = {
        "shot_attempted_flag": 1,
        "shot_attempted": dist,
        "shot_made_flag": make,
        "x":x,
        "y":y,
		"count": data_count
    };
    set_chart(player_data);
    count ++;
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	var game;
  	var player;
    //This code creates the player selection buttons
    var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
	  var ss = snapshot.val();
	  var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" +
	    ss.active_season + "/players/");
	  reff.on("child_added", function (snapshot_player) {
	    snap = snapshot_player.val();
	    var ele = document.createElement("li");
		var a = document.createElement("a");
		var v = document.createTextNode(snap.firstname + " " + snap.lastname);
		a.appendChild(v);
		a.href = "#";
		ele.appendChild(a);
		ele.name = snapshot_player.key;
		a.name = snap.firstname + " " + snap.lastname
		ele.onclick = function() {
		  document.getElementById("playerkey").innerHTML = ele.name;
		  document.getElementById("playername").innerHTML = a.name;
		  player = ele.name;
		  //console.log(player);
		  statsTable(snapshot, game, player);
		  set_chart();
		 };
		 var playerlist = document.getElementById("playerbuttons");
		 playerlist.appendChild(ele);
	  });
	//THis code creates the game selection buttons for the view stats page
		var gref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" +
	    ss.active_season + "/games/");
	  gref.on("child_added", function (snapshot_game) {
		snap = snapshot_game.val();
		var gele = document.createElement("li");
		var ga = document.createElement("a");
		var gv = document.createTextNode(snap.date + " vs. " + snap.opponent);
		ga.appendChild(gv);
		ga.href = "#";
		gele.appendChild(ga);
		gele.name = snapshot_game.key;
		ga.name = snap.date + " vs. " + snap.opponent;
		gele.onclick = function() {
			document.getElementById("gamekey").innerHTML = gele.name;
			document.getElementById("gamename").innerHTML = ga.name;
			game = gele.name;
			//console.log(game);
		};
		var gamelist = document.getElementById("gamebuttons");
		gamelist.appendChild(gele);
	  });
	});
	
	//Fill Team, Season, Game info
	ref.on("child_added", function (snapshot) {
		var ss = snapshot.val();
		document.getElementById("teamname").innerHTML = ss.name;
		document.getElementById("active_season").innerHTML = "Season " + ss.active_season;
		document.getElementById("game").innerHTML = "Game";
		var str = ss.active_game.split("_");
		document.getElementById("active_game").innerHTML = "Game: " + decodeURIComponent(str[0]);
		/*  
		var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" 
		  + ss.active_season + "/games/" + ss.active_game);
		reff.once("value", function(snap) {
			document.getElementById("active_game").innerHTML = "Game: " + snap.date + " vs " + snap.opponent;
		});*/
	});
	
  } else {
    console.log("Error not logged in");
  }
});