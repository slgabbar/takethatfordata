 var player_data = []
 var count = 0;
 var points = 0;
 var pp;

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
	// Points, Attempts
	generatePoints(snapshot, game, player, tr2);


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
		player_data = [];
		snapshot_shot.forEach(function(child) {
			var key = child.key;
			var data = child.val();
			playerShotChart(data.count, data.x, data.y, 
				data.shot_made_flag, data.shot_attempted);
		});
	});

}

function generatePoints(snapshot, game, player, tr) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var pref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/shots/");
	pref.once("value").then(function(snapshot_shot) {
		var points = 0;
		var attempts = 0;
		var makes = 0;
		var attempts3 = 0;
		var makes3 = 0;

		snapshot_shot.forEach(function(child) {
			attempts++;
			var shot = child.val();
			if (shot.shot_made_flag == 1) {
				makes++;
				if (shot.shot_attempted == 3) {
					attempts3++;
					makes3++;
					points += 3;
				}
				if (shot.shot_attempted == 2) {
					points += 2;
				}
			}else {
				if (shot.shot_attempted == 3) {
					attempts3++;
				}
			}
		});
		var tdp = document.createElement("td");
		var p = document.createTextNode(points);
		tdp.appendChild(p);
		tr.appendChild(tdp);
		var tda = document.createElement("td"); 
		var a = document.createTextNode(makes+"/"+attempts);
		tda.appendChild(a);
		tr.appendChild(tda);
		var tdt = document.createElement("td"); 
		var ta = document.createTextNode(makes3+"/"+attempts3);
		tdt.appendChild(ta);
		tr.appendChild(tdt);
	});
}

function generateAttempts(snapshot, game, player, tr) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var pref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/shots/");
	pref.once("value").then(function(snapshot_shot) {
		var points = 0;
		snapshot_shot.forEach(function(child) {
			var shot = child.val();
			if (shot.shot_made_flag == 1) {
				if (shot.shot_attempted == 3) {
					points += 3;
				}
				if (shot.shot_attempted == 2) {
					points += 2;
				}
			}
		});
		console.log(points);
		var tdp = document.createElement("td");
		var p = document.createTextNode(points);
		tdp.appendChild(p);
		tr.appendChild(tdp);
	});
}

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 471 - margin.top - margin.bottom;

//Making it responsive for each screen
var ration = 471/500;
var windowWidth = $(window).width();
//console.log(windowWidth);
if(windowWidth < 500) {
    width = windowWidth;
    height = width * ratio;
};

function set_chart(shot_data) {
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(shot_data).call(shots);
    cpixel_width = $(".shot-chart").width() + 2;
    cpixel_height = $(".shot-chart").height() + 2;
    cmargin_left = $(".shot-chart").offset().left;
    cmargin_top = $(".shot-chart").offset().top;
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
		  statsTable(snapshot, game, player);
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
	});
	
  } else {
    console.log("Error not logged in");
  }
});