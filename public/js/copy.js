//this is a copy so we can import dashboard functions in the view stats page
// without having the onstate changed being called twice
//dashboard
var data = [];
var stats = [];
var adv_stats = [];
var count = 0;
var assists = 0;
var first = 0;
var games = 0;

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


function loadAverages(snapshot) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/");
	ref.once("value").then(function(snapshot_game) {
		var num_games = 0;
		snapshot_game.forEach(function(game) {
			num_games++;
		});
		printTable(num_games);
	});
}

function loadAverages2(snapshot, uid) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/");
	ref.once("value").then(function(snapshot_game) {
		var num_games = 0;
		snapshot_game.forEach(function(game) {
			num_games++;
		});
		printTable(num_games);
	});
}


function printTable(avg) {
	//print stats table averages over avg number of games
	if (avg == 0) {
		alert("No stats to display. Navigate to the dashboard page and" + 
				" select '+ New Game' to begin scouting a new game");
	}else {
		for (var i = 0; i < stats.length; i++) {
			var tr2 = document.createElement("tr");
			tr2.id = "statsrow";
			var p_info = "#" + stats[i].number + " " + stats[i].firstname + " " +  
				stats[i].lastname;
			makeElement(p_info, tr2);
			makeElement((stats[i].points/avg).toFixed(1), tr2);
			var fgg = (stats[i].fgm/avg).toFixed(1) + "/" + (stats[i].fga/avg).toFixed(1);
			makeElement(fgg, tr2);
			var tfgg = (stats[i].fgm3/avg).toFixed(1) + "/" + (stats[i].fga3/avg).toFixed(1);
			makeElement(tfgg, tr2);
			var ftg = (stats[i].ftmake/avg).toFixed(1) + "/" + 
				((stats[i].ftmiss + stats[i].ftmake)/avg).toFixed(1);
			makeElement(ftg, tr2);
			makeElement((stats[i].orebounds/avg).toFixed(1), tr2);
			makeElement((stats[i].drebounds/avg).toFixed(1), tr2);
			makeElement(((stats[i].orebounds + stats[i].drebounds)/avg).toFixed(1), tr2);
			makeElement((stats[i].assists/avg).toFixed(1), tr2);
			makeElement((stats[i].fouls/avg).toFixed(1), tr2);
			makeElement((stats[i].steals/avg).toFixed(1), tr2);
			makeElement((stats[i].turnovers/avg).toFixed(1), tr2);
			console.log(stats[i].blocks/avg);
			makeElement((stats[i].blocks/avg).toFixed(1), tr2);
			var table = document.getElementById("stats_table");
			table.appendChild(tr2);
		}
		var headid = document.getElementById("advhead");

		var pl = document.createElement("th");
		var plg = document.createTextNode("Player");
		pl.appendChild(plg);
		pl.id = "adv_player";
		headid.prepend(pl);

		var th2 = document.createElement("th");
		var ht = document.createTextNode("Game Score");
		th2.appendChild(ht);
		th2.id = "gscore";
		headid.appendChild(th2);

		for (var i = 0; i < adv_stats.length; i++) {
			var tr2 = document.createElement("tr");
			tr2.id = "adv_statsrow";
			var p_info = "#" + stats[i].number + " " + stats[i].firstname + " " +
				stats[i].lastname;
			makeElement(p_info, tr2);
			makeElement((((adv_stats[i].true_shooting)*100)).toFixed(2), tr2);
			makeElement((((adv_stats[i].eff_fg)*100)).toFixed(2), tr2);
			makeElement((((adv_stats[i].two_freq)*100)).toFixed(2), tr2);
			makeElement((((adv_stats[i].three_freq)*100)).toFixed(2), tr2);
			makeElement((((adv_stats[i].ft_rate))).toFixed(2), tr2);
			makeElement((((adv_stats[i].at_ratio))).toFixed(2), tr2);
			makeElement((((adv_stats[i].a_ratio))).toFixed(2), tr2);
			makeElement((((adv_stats[i].to_ratio))).toFixed(2), tr2);
			makeElement((((adv_stats[i].off_rating))).toFixed(2), tr2);
			makeElement((((adv_stats[i].game_score))/avg).toFixed(2), tr2);
			var table = document.getElementById("advstats_table");
			table.appendChild(tr2);
		}
	}

}

function playerSize(snapshot) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/players/");
	ref.once("value").then(function(snapshot_player) {
		var team_length = 0;
		snapshot_player.forEach(function(player) {
			team_length++;;
		});
		initializeJson(team_length);
	});
}

function playerSize2(snapshot, uid) {
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/players/");
	ref.once("value").then(function(snapshot_player) {
		var team_length = 0;
		snapshot_player.forEach(function(player) {
			team_length++;;
		});
		initializeJson(team_length);
	});
}

function loadShots(snapshot) {
	//sums shot data for all players and all games
	console.log("we amde it");
	count = 0;
	playerSize(snapshot);	
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/");
	ref.once("value").then(function(snapshot_game) {
		snapshot_game.forEach(function(game) {
			setTimeout (function() {
				loadPlayerStats(snapshot, game);	
			}, 0);
			var team_query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + 
			"/season_" + snap.active_season + "/games/" + game.key + "/players/");
			team_query.once("value").then(function(snapshot_player) {
				var player_count = 0;
				snapshot_player.forEach(function(player) {
					rowcount++;
					var player_query = db.ref("/users/" + user.uid + "/teams/" + 
						snapshot.key + "/season_" + snap.active_season + "/games/" + 
						game.key + "/players/" + player.key + "/shots/")
					player_query.once("value").then(function(snapshot_shot) {
						var stat = snapshot_shot.val();
						snapshot_shot.forEach(function(shot) {
							var shot_data = shot.val();
							data[count] = {
        						"shot_attempted_flag": shot_data.shot_attempted_flag,
        						"shot_attempted": shot_data.shot_attempted,
        						"shot_made_flag": shot_data.shot_made_flag,
        						"x":shot_data.x,
        						"y":shot_data.y,
								"count": shot_data.count
							}
							loadAdvShot(player_count, shot_data.shot_made_flag, shot_data.shot_attempted);
							count++;
						});
						set_chart(data);
						player_count++;
					});
				});
			});
		});
	});
}

function loadShots2(snapshot, uid) {
	//sums shot data for all players and all games
	console.log("we amde it");
	count = 0;
	playerSize2(snapshot, uid);	
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/");
	ref.once("value").then(function(snapshot_game) {
		snapshot_game.forEach(function(game) {
			setTimeout (function() {
				loadPlayerStats2(snapshot, uid, game);	
			}, 0);
			var team_query = db.ref("/users/" + uid + "/teams/" + snapshot.key + 
			"/season_" + snap.active_season + "/games/" + game.key + "/players/");
			team_query.once("value").then(function(snapshot_player) {
				var player_count = 0;
				snapshot_player.forEach(function(player) {
					rowcount++;
					var player_query = db.ref("/users/" + uid + "/teams/" + 
						snapshot.key + "/season_" + snap.active_season + "/games/" + 
						game.key + "/players/" + player.key + "/shots/")
					player_query.once("value").then(function(snapshot_shot) {
						var stat = snapshot_shot.val();
						snapshot_shot.forEach(function(shot) {
							var shot_data = shot.val();
							data[count] = {
        						"shot_attempted_flag": shot_data.shot_attempted_flag,
        						"shot_attempted": shot_data.shot_attempted,
        						"shot_made_flag": shot_data.shot_made_flag,
        						"x":shot_data.x,
        						"y":shot_data.y,
								"count": shot_data.count
							}
							loadAdvShot(player_count, shot_data.shot_made_flag, shot_data.shot_attempted);
							count++;
						});
						set_chart(data);
						player_count++;
					});
				});
			});
		});
	});
}


function loadAdvShot(shot_count, made, dist) {
	//console.log(shot_count);
	stats[shot_count].fga += 1;
	if (dist == 3) {
		stats[shot_count].fga3 += 1;
	}
	if (made == 1) {
		stats[shot_count].fgm += 1;
		stats[shot_count].points += 2;
		if (dist == 3) {
			stats[shot_count].fgm3 += 1;
			stats[shot_count].points += 1;
		}
	}
}

function initializeJson(length) {
	for (var i = 0; i < length; i++) {
		stats[i] = {
			"firstname": "",
			"lastname": "",
			"number": "",
			"assists": 0,
			"blocks": 0,
			"fouls": 0,
			"ftmake": 0,
			"ftmiss": 0,
			"drebounds": 0,
			"orebounds": 0,
			"steals": 0,
			"turnovers": 0,
			"fga": 0,
			"fgm": 0,
			"fga3": 0,
			"fgm3": 0,
			"points": 0
		}
		adv_stats[i] = {
			"true_shooting": 0,
			"eff_fg": 0,
			"two_freq": 0,
			"three_freq": 0,
			"ft_rate": 0,
			"at_ratio": 0,
			"a_ratio": 0,
			"to_ratio": 0,
			"off_rating": 0,
			"game_score": 0
		}
	}
}

function playerInfo(snapshot) {
	//loads player name and number
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/players/");
	ref.once("value").then(function(snapshot_player) {
		var player_count = 0;
		snapshot_player.forEach(function(player) {
			var info = player.val();
			stats[player_count].firstname += info.firstname;
			stats[player_count].lastname += info.lastname;
			stats[player_count].number += info.number;
			player_count++;
		});
	});
}

function playerInfo2(snapshot, uid) {
	//loads player name and number
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/players/");
	ref.once("value").then(function(snapshot_player) {
		var player_count = 0;
		snapshot_player.forEach(function(player) {
			var info = player.val();
			stats[player_count].firstname += info.firstname;
			stats[player_count].lastname += info.lastname;
			stats[player_count].number += info.number;
			player_count++;
		});
	});
}


function loadPlayerStats(snapshot, game) {
	//cumilates all stats for players for each game
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/" + game.key + "/players/");
	ref.once("value").then(function(snapshot_players) {
		var player_count = 0;
		snapshot_players.forEach(function(player) {
			var data = player.val();
			stats[player_count].assists += data.assists;
			stats[player_count].blocks += data.blocks;
			stats[player_count].fouls += data.fouls;
			stats[player_count].ftmake += data.ftmake;
			stats[player_count].points += data.ftmake;
			stats[player_count].ftmiss += data.ftmiss;
			stats[player_count].drebounds += data.drebounds;
			stats[player_count].orebounds += data.orebounds;
			stats[player_count].steals += data.steals;
			stats[player_count].turnovers += data.turnovers;
			player_count++;
		});
	});
}

function loadPlayerStats2(snapshot, uid, game) {
	//cumilates all stats for players for each game
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/" + game.key + "/players/");
	ref.once("value").then(function(snapshot_players) {
		var player_count = 0;
		snapshot_players.forEach(function(player) {
			var data = player.val();
			stats[player_count].assists += data.assists;
			stats[player_count].blocks += data.blocks;
			stats[player_count].fouls += data.fouls;
			stats[player_count].ftmake += data.ftmake;
			stats[player_count].points += data.ftmake;
			stats[player_count].ftmiss += data.ftmiss;
			stats[player_count].drebounds += data.drebounds;
			stats[player_count].orebounds += data.orebounds;
			stats[player_count].steals += data.steals;
			stats[player_count].turnovers += data.turnovers;
			player_count++;
		});
	});
}

function advancedStats() {
	for (var i = 0; i < stats.length; i++) {
		if ([2*(stats[i].fga + 
			 (.44*(stats[i].ftmake + stats[i].ftmiss)))] == 0) {
			adv_stats[i].true_shooting = 0;
		} else {
			adv_stats[i].true_shooting = stats[i].points / [2*(stats[i].fga + 
				 (.44*(stats[i].ftmake + stats[i].ftmiss)))];
		}
		if (stats[i].fga == 0) {
			adv_stats[i].eff_fg = 0
			adv_stats[i].two_freq = 0;
			adv_stats[i].three_freq = 0;
			adv_stats[i].ft_rate = 0;
		} else {
			adv_stats[i].eff_fg = ((stats[i].fgm + (.5 * stats[i].fgm3)))
				 / stats[i].fga;
			adv_stats[i].two_freq = (stats[i].fga - stats[i].fga3)/stats[i].fga;
			adv_stats[i].three_freq = stats[i].fga3 / stats[i].fga;
			adv_stats[i].ft_rate = (stats[i].ftmake + stats[i].ftmiss) / stats[i].fga;
		}
		if (stats[i].turnovers == 0) {
			adv_stats[i].at_ratio = 0;
		} else {
			adv_stats[i].at_ratio = stats[i].assists / stats[i].turnovers;
		}
		if ((stats[i].fga + 
			 ((stats[i].ftmiss + stats[i].ftmake)*.44) + stats[i].assists +
			  stats[i].turnovers) == 0) {
			adv_stats[i].a_ratio = 0;
			adv_stats[i].to_ratio = 0;
		} else {
			adv_stats[i].a_ratio = (stats[i].assists * 100) / (stats[i].fga + 
				 ((stats[i].ftmiss + stats[i].ftmake)*.44) + stats[i].assists +
				  stats[i].turnovers);
			adv_stats[i].to_ratio = (stats[i].turnovers * 100) / (stats[i].fga + 
			 ((stats[i].ftmiss + stats[i].ftmake)*.44) + stats[i].assists +
			  stats[i].turnovers);

		}
		if ((stats[i].fga + 
			 stats[i].turnovers + ((stats[i].ftmiss + stats[i].ftmake)*.44) - 
			 stats[i].orebounds) == 0) {
			adv_stats[i].off_rating = 0;
		} else {
			adv_stats[i].off_rating = (stats[i].points * 100) / (stats[i].fga + 
				 stats[i].turnovers + ((stats[i].ftmiss + stats[i].ftmake)*.44) - 
				 stats[i].orebounds);
		}
		adv_stats[i].game_score = (stats[i].points * 1.0) + 
								  (stats[i].fgm * .4) - 
								  (stats[i].fga * .7) - 
								  (stats[i].ftmiss * .4) + 
								  (stats[i].orebounds * .7) + 
								  (stats[i].drebounds * .3) + 
								  (stats[i].steals * 1.0) + 
								  (stats[i].assists * .7) + 
								  (stats[i].blocks * .7) - 
								  (stats[i].fouls * .4) - 
								  (stats[i].turnovers * 1.0);
	}
	//console.log(stats);
	//console.log(adv_stats);
}

function deleteTables(team_length) {
	console.log(team_length);
	for (var i = 0; i < team_length+1; i++) {
		if (document.getElementById("statsrow")) {
			document.getElementById("statsrow").remove();
		}
	}	
	for (var i = 0; i < team_length; i++) {
		if (document.getElementById("adv_statsrow")) {	
					document.getElementById("adv_statsrow").remove();
		}
	}
}


/*firebase.auth().onAuthStateChanged(function(user) {
	var user = firebase.auth().currentUser;
	var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
		var ss = snapshot.val();
		var name = ss.name;
		var school = ss.school;
		var location = ss.location;
		var season = ss.active_season;
		setHeader(name, school, location, season);
		loadShots(snapshot);
		setTimeout (function() {
			playerInfo(snapshot);	
		}, 0);
		setTimeout (function() {
			//this is where to call advanced stats functions
			advancedStats();	
		}, 1000);
		setTimeout (function() {
			loadAverages(snapshot);
		}, 1000);
	});
});*/

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
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("hexbin");
    shot_chart.call(court);
    shot_chart.datum(shot_data).call(shots);
    cpixel_width = $(".shot-chart").width() + 2;
    cpixel_height = $(".shot-chart").height() + 2;
    cmargin_left = $(".shot-chart").offset().left;
    cmargin_top = $(".shot-chart").offset().top;
}

// Make table element
function makeElement(statv, tr) {
	var te = document.createElement("td");
	var tn = document.createTextNode(statv);
	te.appendChild(tn);
	tr.appendChild(te);
}

function setHeader(name, school, loc, season) {
	//set html headers
	document.getElementById("team_name").innerHTML = name;
	document.getElementById("school").innerHTML = school;
	document.getElementById("location").innerHTML = loc;
	document.getElementById("active_sea").innerHTML = "Active Season: "+ season;
}