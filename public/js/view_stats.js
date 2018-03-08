 var player_data = []
 var team_data = []
 var player_count = 0;
 var team_count = 0;

 var total_points = 0;
 var total_makes = 0;
 var total_attempts = 0;
 var total_makes3 = 0;
 var total_attempts3 = 0;
 var total_ftmakes = 0;
 var total_ftattempts = 0;
 var total_rebounds = 0;
 var total_assists = 0;
 var total_fouls = 0;
 var total_steals = 0;
 var total_turnovers = 0;
 var total_blocks = 0;

 var fake = 0;

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
	//creates the player stats table
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	var gameref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game);
	// Remove previous stats table
	if (document.getElementById("statsrow")) {
		document.getElementById("statsrow").remove();
	}
	// Create the row
	var tr2 = document.createElement("tr");
	tr2.id = "statsrow";
	// Get the game
	gameref.once("value").then(function(snapshot_game){
		var gameval = snapshot_game.val();
		var gameinfo = gameval.date + " vs. " + gameval.opponent;
		var gametd = document.createElement("td");
		var gametext = document.createTextNode(gameinfo);
		gametd.appendChild(gametext);
		tr2.appendChild(gametd);
	});
	// Points, Attempts, FTs, other stats
	generatePoints(snapshot, game, player, tr2, 0);
	generateStat(snapshot, game, player, tr2, "rebounds", 0);
 	generateStat(snapshot, game, player, tr2, "assists", 0);
 	generateStat(snapshot, game, player, tr2, "fouls", 0);
 	generateStat(snapshot, game, player, tr2, "steals", 0);
 	generateStat(snapshot, game, player, tr2, "turnovers", 0);
 	generateStat(snapshot, game, player, tr2, "blocks", 0);
 	// Append to the table
	var tableid = document.getElementById("stats_table");
	tableid.appendChild(tr2);
}

// Create the team stats table
function teamStatsTable(snapshot, game) {
	total_points = 0;
	total_makes = 0;
	total_attempts = 0;
	total_makes3 = 0;
	total_attempts3 = 0;
	total_ftmakes = 0;
	total_ftattempts = 0;
	total_rebounds = 0;
 	total_assists = 0;
 	total_fouls = 0;
 	total_steals = 0;
 	total_turnovers = 0;
 	total_blocks = 0;
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/");
	var gameref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game);
	// Remove the current stats table
	if (document.getElementById("statsrow")) {
		document.getElementById("statsrow").remove();
	}
	var tr2 = document.createElement("tr");
	tr2.id = "statsrow";
	// Get the game
	gameref.once("value").then(function(snapshot_game){
		var gameval = snapshot_game.val();
		var gameinfo = gameval.date + " vs. " + gameval.opponent;
		var gametd = document.createElement("td");
		var gametext = document.createTextNode(gameinfo);
		gametd.appendChild(gametext);
		tr2.appendChild(gametd);
	});
	// For each player in the game
	query.once("value").then(function(snapshot_player) {
		snapshot_player.forEach(function(child) {
			// Generate the total stats
			generatePoints(snapshot, game, child.key, tr2, 1);
			generateStat(snapshot, game, child.key, tr2, "rebounds", 1);
			generateStat(snapshot, game, child.key, tr2, "assists", 1);
			generateStat(snapshot, game, child.key, tr2, "fouls", 1);
			generateStat(snapshot, game, child.key, tr2, "steals", 1);
			generateStat(snapshot, game, child.key, tr2, "turnovers", 1);
			generateStat(snapshot, game, child.key, tr2, "blocks", 1);
		});
		// Timeout function, for some reason needed in order to work
		setTimeout(function() {
			// Make element for all the stat categories
			makeElement(total_points, tr2)
			var fgs = total_makes + "/" + total_attempts;
			makeElement(fgs, tr2);
			var fgs3 = total_makes3 + "/" + total_attempts3;
			makeElement(fgs3, tr2);
			var ft = total_ftmakes + "/" + total_ftattempts;
			makeElement(ft, tr2);
			makeElement(total_rebounds, tr2);
			makeElement(total_assists, tr2);
			makeElement(total_fouls, tr2);
			makeElement(total_steals, tr2);
			makeElement(total_turnovers, tr2);
			makeElement(total_blocks, tr2);
		}, 0);
	});
 	// Append to the table
	var tableid = document.getElementById("stats_table");
	tableid.appendChild(tr2);
}

// Make table element
function makeElement(statv, tr) {
	var te = document.createElement("td");
	var tn = document.createTextNode(statv);
	te.appendChild(tn);
	tr.appendChild(te);
}

// Generate stat
function generateStat(snapshot, game, player, tr, stat, flag) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/" + stat + "/");
	ref.once("value").then(function(snapshot_stats) {
		var stats = snapshot_stats.val();
		if (stat == "rebounds") {
			total_rebounds += stats;
		}else if (stat == "assists") {
			total_assists += stats;
		}else if (stat == "fouls") {
			total_fouls += stats;
		}else if (stat == "steals") {
			total_steals += stats;
		}else if (stat == "turnovers") {
			total_turnovers += stats;
		}else if (stat == "blocks") {
			total_blocks += stats;
		}
		if (flag == 0) {
			var tds = document.createElement("td");
			var v = document.createTextNode(stats);
			tds.appendChild(v);
			tr.appendChild(tds);
		}
	});
}

// Generate points, attempts, freethrows
function generatePoints(snapshot, game, player, tr, flag) {
	//generates the poinjts from the shot data
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
		if (flag == 1) {
			total_makes += makes;
			total_attempts += attempts;
			total_makes3 += makes3;
			total_attempts3 += attempts3;
	 		generateFTPoints(snapshot, game, player, points, tdp, flag);
			generateFTA(snapshot, game, player, tdf, flag);
		}else {
			var tdp = document.createElement("td");
		 	generateFTPoints(snapshot, game, player, points, tdp, flag);
			tr.appendChild(tdp);
			var tda = document.createElement("td"); 
			var a = document.createTextNode(makes+"/"+attempts);
			tda.appendChild(a);
			tr.appendChild(tda);
			var tdt = document.createElement("td"); 
			var ta = document.createTextNode(makes3+"/"+attempts3);
			tdt.appendChild(ta);
			tr.appendChild(tdt);
			var tdf = document.createElement("td");
			generateFTA(snapshot, game, player, tdf, flag);
			tr.appendChild(tdf);
		}
			
	});
}

function generateFTPoints(snapshot, game, player, points, tdp, flag) {
	//generates ft points from shot data
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var fref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	fref.once("value").then(function(snapshot_stat) {
		var stat = snapshot_stat.val();
		points += stat.ftmake;
		total_points += points;
		if (flag == 0) {
			var p = document.createTextNode(points);
			tdp.appendChild(p);
		}
	});
}

function generateFTA(snapshot, game, player, tdf, flag) {
	//generates ft attempts from shot data
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var fref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	fref.once("value").then(function(snapshot_stat) {
		var stat = snapshot_stat.val();
		var ftattempts = stat.ftmake + stat.ftmiss;
		total_ftmakes += stat.ftmake;
		total_ftattempts += ftattempts;
		if (flag == 0) {
			var f = document.createTextNode(stat.ftmake+"/"+ftattempts);
			tdf.appendChild(f);
		}
	});
}

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 471 - margin.top - margin.bottom;

//Making it responsive for each screen
var ration = 471/500;
var windowWidth = $(window).width();
if(windowWidth < 500) {
    width = windowWidth;
    height = width * ratio;
};

function set_chart(shot_data) {
	//draws shotchart with shot_data
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

function playerShotChart(snapshot, game_id, player_id) {
	//creates player shot chart from specidfic game
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game_id + "/players/" + player_id + "/shots/");
	query.once("value").then(function(snapshot_shot) {
		player_count = 0;
		player_data = [];
		snapshot_shot.forEach(function(child) {
			var data = child.val();
			player_data[player_count] = {
        		"shot_attempted_flag": data.shot_attempted_flag,
        		"shot_attempted": data.shot_attempted,
        		"shot_made_flag": data.shot_made_flag,
        		"x":data.x,
        		"y":data.y,
				"count": data.count
			}
			player_count++;
		});
		set_chart(player_data);
	});
}

function teamShotChart(snapshot, game) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/");
	query.once("value").then(function(snapshot_player) {
		team_count = 0;
		team_data = [];
		snapshot_player.forEach(function(child) {
			var shotquery = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
				snap.active_season + "/games/" + game + "/players/"+ child.key + "/shots/");
			shotquery.once("value").then(function(snapshot_shot) {
				snapshot_shot.forEach(function(schild) {
					var data = schild.val();
					team_data[team_count] = {
						"shot_attempted_flag": data.shot_attempted_flag,
        				"shot_attempted": data.shot_attempted,
        				"shot_made_flag": data.shot_made_flag,
        				"x":data.x,
        				"y":data.y,
						"count": data.count
					}
					team_count++;
				});
				set_chart(team_data);
			});
		});
	});
}

// Clear the player chart
function clearChart() {
	player_data = []
	set_chart(player_data);
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
		  		// Generate player shot chart and stat table
		  		playerShotChart(snapshot, game, player);
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
				// Clear player chart, for some reason necessary 
				clearChart();
				setTimeout(function() {
					// Generate team shot chart
					teamShotChart(snapshot, game);
				}, 1020);
				// Generate team stats table
				teamStatsTable(snapshot, game);
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