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
var total_orebounds = 0;
var total_drebounds = 0;
var total_trebounds = 0;
var total_assists = 0;
var total_fouls = 0;
var total_steals = 0;
var total_turnovers = 0;
var total_blocks = 0;

var points = 0;
var makes = 0;
var attempts = 0;
var makes3 = 0;
var attempts3 = 0;
var ftmakes = 0;
var ftattempts = 0;
var orebounds = 0;
var drebounds = 0;
var trebounds = 0;
var assists = 0;
var fouls = 0;
var steals = 0;
var turnovers = 0;
var blocks = 0;

var team = 0;

var rowcount = 0;

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

function statsTable(snapshot, uid, game, player, flag) {
	//creates the player stats table
	trebounds = 0;
	++rowcount;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	var playref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/players/" + player);
	// Remove previous stats table
	if (flag == 0) {
		for (var i = 0; i < rowcount; i++) {
			if (document.getElementById("statsrow")) {
				//document.getElementById("statsrow").remove();
			}
		}
	}
	// Create the row
	var tr2 = document.createElement("tr");
	tr2.id = "statsrow";
	// Get the game

	playref.once("value").then(function(snapshot_play){
		var playval = snapshot_play.val();
		var playinfo = "#" + playval.number + " " + playval.firstname + " " + playval.lastname;
		makeElement(playinfo, tr2);
	});
	// Points, Attempts, FTs, other stats
	setTimeout(function() {
		generatePoints(snapshot, uid, game, player, tr2, 0);
		generateStat(snapshot, uid, game, player, tr2, "orebounds", 0);
		generateStat(snapshot, uid, game, player, tr2, "drebounds", 0);
	}, 0);
	setTimeout(function() {
		makeElement(trebounds, tr2);
		trebounds = 0;
	}, 0);
	setTimeout(function() {
 		generateStat(snapshot, uid, game, player, tr2, "assists", 0);
 		generateStat(snapshot, uid, game, player, tr2, "fouls", 0);
 		generateStat(snapshot, uid, game, player, tr2, "steals", 0);
 		generateStat(snapshot, uid, game, player, tr2, "turnovers", 0);
 		generateStat(snapshot, uid, game, player, tr2, "blocks", 0);
 	}, 0);
 	// Append to the table
	var tableid = document.getElementById("stats_table");
	tableid.appendChild(tr2);

}

function teamStatsTable(snapshot, uid, game) {
	total_points = 0;
	total_makes = 0;
	total_attempts = 0;
	total_makes3 = 0;
	total_attempts3 = 0;
	total_ftmakes = 0;
	total_ftattempts = 0;
	total_orebounds = 0;
    total_drebounds = 0;
    total_trebounds = 0;
 	total_assists = 0;
 	total_fouls = 0;
 	total_steals = 0;
 	total_turnovers = 0;
 	total_blocks = 0;
	var snap = snapshot.val();
	var query = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/");
	var gameref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game);
	// Remove the current stats table
	for (var i = 0; i < rowcount + 1; i++) {
		if (document.getElementById("statsrow")) {
			//document.getElementById("statsrow").remove();
		}
	}

	query.once("value").then(function(snapshot_player) {
		snapshot_player.forEach(function(child) {
			statsTable (snapshot, uid, game, child.key, 1);
		});
	});

	// Generate total stats for game
	var tr2 = document.createElement("tr");
	tr2.id = "statsrow";
	// Set player to total
	makeElement("Total", tr2);
	// For each player in the game
	query.once("value").then(function(snapshot_player) {
		snapshot_player.forEach(function(child) {
			// Generate the total stats
			generatePoints(snapshot, uid, game, child.key, tr2, 1);
			generateStat(snapshot, uid, game, child.key, tr2, "orebounds", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "drebounds", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "assists", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "fouls", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "steals", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "turnovers", 1);
			generateStat(snapshot, uid, game, child.key, tr2, "blocks", 1);
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
			makeElement(total_orebounds, tr2);
			makeElement(total_drebounds, tr2);
			total_trebounds = total_orebounds + total_drebounds;
			makeElement(total_trebounds, tr2);
			makeElement(total_assists, tr2);
			makeElement(total_fouls, tr2);
			makeElement(total_steals, tr2);
			makeElement(total_turnovers, tr2);
			makeElement(total_blocks, tr2);
		}, 0);
 
	});
 	// Append to the table
 	//rowcount = 0;
 	setTimeout (function() {
		var tableid = document.getElementById("stats_table");
		tableid.appendChild(tr2);
	}, 0);
}


function advTable() {
	if (document.getElementById("advstatsrow")) {
		document.getElementById("advstatsrow").remove();
	}
	if (document.getElementById("adv_player")) {
		document.getElementById("adv_player").remove();
	}

	if (document.getElementById("gscore")) {
		document.getElementById("gscore").remove();
	}
	var gh = document.createElement("th");
	var ht = document.createTextNode("Game Score");
	gh.appendChild(ht);
	gh.id = "gscore";
	var headid = document.getElementById("advhead");
		headid.appendChild(gh);

	tpoints = points + ftmakes;
	var attempts2 = attempts - attempts3;
	trebounds = orebounds + drebounds;

	var tra = document.createElement("tr");
	tra.id = "advstatsrow";

	setTimeout(function() {
		trueShooting(tpoints, attempts, ftattempts, tra);
		effectiveFG(makes, makes3, attempts, tra);
		frequency2(attempts2, attempts, tra);
 		frequency2(attempts3, attempts, tra);
 		ftRate(ftattempts, attempts, tra);
 		assTurn(assists, turnovers, tra);
 		assRat(assists, attempts, ftattempts, turnovers, tra);
 		tovRat(turnovers, attempts, ftattempts, assists, tra);
 		oRTG(tpoints, attempts, turnovers, ftattempts, orebounds, tra);
 		gScore(tpoints, makes, attempts, ftattempts, ftmakes, orebounds, drebounds, steals, assists, blocks, fouls, turnovers, tra);
	}, 0);
	var tableid = document.getElementById("advstats_table");
		tableid.appendChild(tra);
}

function teamAdvTable() {
	if (document.getElementById("advstatsrow")) {
		document.getElementById("advstatsrow").remove();
	}
	if (document.getElementById("adv_player")) {
		document.getElementById("adv_player").remove();
	}
	if (document.getElementById("gscore")) {
		document.getElementById("gscore").remove();
	}
 	var total_attempts2 = total_attempts - total_attempts3;
 	total_trebounds = total_orebounds + total_drebounds;
	var tra = document.createElement("tr");
	tra.id = "advstatsrow";

 	trueShooting(total_points, total_attempts, total_ftattempts, tra);
 	effectiveFG(total_makes, total_makes3, total_attempts, tra);
 	frequency2(total_attempts2, total_attempts, tra);
 	frequency2(total_attempts3, total_attempts, tra);
 	ftRate(total_ftattempts, total_attempts, tra);
 	assTurn(total_assists, total_turnovers, tra);
 	assRat(total_assists, total_attempts, total_ftattempts, total_turnovers, tra);
 	tovRat(total_turnovers, total_attempts, total_ftattempts, total_assists, tra);
 	oRTG(total_points, total_attempts, total_turnovers, total_ftattempts, total_orebounds, tra);

 	var tableid = document.getElementById("advstats_table");
		tableid.appendChild(tra);
}

function trueShooting(pts, ats, ftats, tr) {
	var ts = 0;
	if (((2*(ats + (0.44*ftats)))) != 0) {
		ts = (pts / (2*(ats + (0.44*ftats))));
	}
	makeElement((ts*100).toFixed(2), tr);
}

function effectiveFG (mks, mks3, ats, tr) {
	var efg = 0;
	if (ats != 0) {
		efg = ((mks + (0.5 * mks3)) / ats);
	}
	makeElement((efg*100).toFixed(2), tr);
}

function frequency2 (ats2, ats, tr) {
	var freq2 = 0;
	if (ats != 0) {
		freq2 = (ats2/ats);
	}	
	makeElement((freq2*100).toFixed(2), tr);
}

function frequency3 (ats3, ats, tr) {
	var freq3 = 0;
	if (ats != 0) {
		freq3 = (ats3/ats);
	}
	makeElement((freq3*100).toFixed(2), tr);
}

function ftRate (ftats, ats, tr) {
	var ftR = 0;
	if (ats != 0) {
		ftR = (ftats/ats);
	}
	makeElement(ftR.toFixed(3), tr);
}

function assTurn (ass, turn, tr) {
	var at = (ass / turn);
	if (turn == 0) {
		at = ass;
	}
	makeElement(at.toFixed(3), tr);
}

function assRat (ass, ats, ftats, turn, tr) {
	var ar = 0;
	if ( (ats + (ftats * 0.44) + ass + turn) != 0) {
		ar = (((ass * 100) / (ats + (ftats * 0.44) + ass + turn)));
	}
	makeElement(ar.toFixed(2), tr);
}

function tovRat (turn, ats, ftats, ass, tr) {
	var trat = 0;
	if ((ats + (ftats * 0.44) + ass + turn) != 0) {
		trat = (((turn * 100) / (ats + (ftats * 0.44) + ass + turn)));
	}
	makeElement(trat.toFixed(2), tr);
}

function oRTG (pts, ats, turn, ftats, oreb, tr) {
	var ort = 0;
	if ((ats + turn + (0.44 * ftats) - oreb) != 0) {
		ort = ((100 * pts) / (ats + turn + (0.44 * ftats) - oreb));
	}
	makeElement(ort.toFixed(2), tr);
}

// Players only baby
function gScore (pts, mks, ats, ftats, ftmks, oreb, dreb, stl, ass, blk, foul, turn ,tr) {
	var gs = (pts + (mks * 0.4) + (ats * (-0.7)) + 
			 ((ftats - ftmks) * (-0.4)) + (oreb * 0.7) + 
			 (dreb * 0.3) + stl + (ass * 0.7) + 
			 (blk * 0.7) + (foul * (-0.4)) + (turn * (-1)));
	makeElement(gs.toFixed(2), tr);
}

// Make table element
function makeElement(statv, tr) {
	var te = document.createElement("td");
	var tn = document.createTextNode(statv);
	te.appendChild(tn);
	tr.appendChild(te);
}

function generateStat(snapshot, uid, game, player, tr, stat, flag) {
	var snap = snapshot.val();
	var ref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/" + stat + "/");
	ref.once("value").then(function(snapshot_stats) {
		var stats = snapshot_stats.val();
		if (flag == 0) {
			if (stat == "orebounds") {
				orebounds = stats;
				trebounds += stats;
			}else if (stat ==  "drebounds") {
				drebounds = stats;
				trebounds += stats;
			}else if (stat == "assists") {
				assists = stats;
			}else if (stat == "fouls") {
				fouls = stats;
			}else if (stat == "steals") {
				steals = stats;
			}else if (stat == "turnovers") {
				turnovers = stats;
			}else if (stat == "blocks") {
				blocks = stats;
			}
			makeElement(stats, tr);
		}else if (flag == 1) {
			if (stat == "orebounds") {
				total_orebounds += stats;
			}else if (stat == "drebounds") {
				total_drebounds += stats;
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
		}
	});
}

// Generate points, attempts, freethrows
function generatePoints(snapshot, uid, game, player, tr, flag) {
	//generates the poinjts from the shot data
	var snap = snapshot.val();
	var pref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player + "/shots/");
	pref.once("value").then(function(snapshot_shot) {
		points = 0;
		makes = 0;
		attempts = 0;
		makes3 = 0;
		attempts3 = 0;
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
	 		generateFTPoints(snapshot, uid, game, player, points, tdp, flag);
			generateFTA(snapshot, uid, game, player, tdf, flag);
		}else {
			var tdp = document.createElement("td");
		 	generateFTPoints(snapshot, uid, game, player, points, tdp, flag);
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
			generateFTA(snapshot, uid, game, player, tdf, flag);
			tr.appendChild(tdf);
		}
			
	});
}

function generateFTPoints(snapshot, uid, game, player, ppoints, tdp, flag) {
	//generates ft points from shot data
	var snap = snapshot.val();
	var fref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	fref.once("value").then(function(snapshot_stat) {
		var stat = snapshot_stat.val();
		ppoints += stat.ftmake;
		if (flag == 0) {
			var p = document.createTextNode(ppoints);
			tdp.appendChild(p);
		}else {
			total_points += ppoints;
		}
	});
}

function generateFTA(snapshot, uid, game, player, tdf, flag) {
	//generates ft attempts from shot data
	var snap = snapshot.val();
	var fref = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/" + player);
	fref.once("value").then(function(snapshot_stat) {
		var stat = snapshot_stat.val();
		ftmakes = stat.ftmake;
		ftattempts = stat.ftmake + stat.ftmiss;
		if (flag == 0) {
			var f = document.createTextNode(stat.ftmake+"/"+ftattempts);
			tdf.appendChild(f);
		}else {
			total_ftmakes += stat.ftmake;
			total_ftattempts += ftattempts;
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
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(false).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(shot_data).call(shots);
    cpixel_width = $(".shot-chart").width() + 2;
    cpixel_height = $(".shot-chart").height() + 2;
    cmargin_left = $(".shot-chart").offset().left;
    cmargin_top = $(".shot-chart").offset().top;
}

function toHexbin() {
	var sdata = [];
	if (team == 1){
		sdata = team_data;
	}else {
		sdata = player_data;
	}
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(true).displayType("hexbin");
    shot_chart.call(court);
    shot_chart.datum(sdata).call(shots);
}

function toScatter() {
	var sdata = [];
	if (team == 1){
		sdata = team_data;
	}else {
		sdata = player_data;
	}
    var shot_chart = d3.select(".shot-chart").attr('width', width - margin.left + margin.right);
    var court = d3.court().width(700);
    var shots = d3.shots().shotRenderThreshold(1).displayToolTips(false).displayType("scatter");
    shot_chart.call(court);
    shot_chart.datum(sdata).call(shots);
}

function playerShotChart(snapshot, uid, game_id, player_id) {
	//creates player shot chart from specidfic game
	var snap = snapshot.val();
	var query = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
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

function teamShotChart(snapshot, uid, game) {
	var snap = snapshot.val();
	var query = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season + "/games/" + game + "/players/");
	query.once("value").then(function(snapshot_player) {
		team_count = 0;
		team_data = [];
		snapshot_player.forEach(function(child) {
			var shotquery = db.ref("/users/" + uid + "/teams/" + snapshot.key + "/season_" + 
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

function clearChart() {
	player_data = []
	set_chart(player_data);
}

var userid = "";
var teamid = "";
var seasonid = "";
var playerid = "";

function loadurl () {
	var url = window.location.pathname;
	var surl = url.split('/');
	userid = surl[3];
	console.log("user id: "+ userid);
	teamid = surl[5];
	console.log("team id: "+ teamid);
	seasonid = surl[6];
	console.log("season id: "+ seasonid);
	playerid = surl[8];
	console.log("player id: "+ playerid);
}

function main () {
	loadurl();
	var game;
  	var player;
  	var nam;
  	var sch;
  	var loc;
  	var sea;
	var ref = db.ref("/users/" + userid + "/teams");
	ref.on("child_added", function (snapshot) {
		var ss = snapshot.val();
		var gref = db.ref("/users/" + userid + "/teams/" + snapshot.key + "/season_" +
					ss.active_season + "/games/");
		nam = ss.name;
		sch = ss.school;
		loc = ss.location;
		sea = ss.active_season;
		gref.once("value").then(function(snapshot_game) {
			snapshot_game.forEach(function(child) {
				var childval = child.val();
				console.log(childval);
				var gele = document.createElement("li");
				var ga = document.createElement("a");
				var gv = document.createTextNode(childval.date + " vs. " + childval.opponent);
				ga.appendChild(gv);
				ga.href = "#";
				gele.appendChild(ga);
				gele.name = child.key;
				ga.name = childval.date + " vs. " + childval.opponent;
				document.getElementById("gamekey").innerHTML = gele.name;
				document.getElementById("playername").innerHTML = "All";
				document.getElementById("gamename").innerHTML = ga.name;
				game = gele.name;
				gele.onclick = function() {
					$("#headers").hide();
					$("#active").show();
					deleteTables(rowcount);
					rowcount = 0;
					document.getElementById("gamekey").innerHTML = gele.name;
					document.getElementById("playername").innerHTML = "All";
					document.getElementById("gamename").innerHTML = ga.name;
					game = gele.name;
					clearChart();
					setTimeout(function() {
						// Generate team shot chart
						teamShotChart(snapshot, userid, game);
					}, 1020);
					// Generate team stats table
					teamStatsTable(snapshot, userid, game);
					setTimeout(function() {
						teamAdvTable();
					});
					team = 1;
				}
				var gamelist = document.getElementById("gamebuttons");
				gamelist.appendChild(gele);
			});
		});
		if (playerid) {
		var ipref = db.ref("/users/" + userid + "/teams/" + snapshot.key + "/season_" +
	    			ss.active_season + "/players/"+ playerid);
		ipref.once("value").then(function(splayer) {
			var p = splayer.val();
			var pname = "#" + p.number + " " + p.firstname + " " + p.lastname;
			document.getElementById("playerkey").innerHTML = p.key;
			document.getElementById("playername").innerHTML = pname;
			player = splayer.key;
		});
		}
		var reff = db.ref("/users/" + userid + "/teams/" + snapshot.key + "/season_" +
	    			ss.active_season + "/players/");
		reff.once("value").then(function(snapshot_player) {
			snap = snapshot_player.val();
			console.log(snap);
			snapshot_player.forEach(function(child) {
				console.log(child.val());
				var childval = child.val();
	    		var ele = document.createElement("li");
				var a = document.createElement("a");
				var v = document.createTextNode(childval.firstname + " " + childval.lastname);
				console.log(v);
				a.appendChild(v);
				a.href = "#";
				ele.appendChild(a);
				ele.name = child.key;
				a.name = "#" + childval.number + " " +childval.firstname + " " + childval.lastname;
				ele.onclick = function() {
					$("#headers").hide();
					$("#active").show();
					deleteTables(rowcount);
					rowcount = 0;
					console.log("HERE");
		  			document.getElementById("playerkey").innerHTML = ele.name;
		  			document.getElementById("playername").innerHTML = a.name;
		  			player = ele.name;
		  			console.log(player);
		  			// Generate player shot chart and stat table
		  			if (game) {
		  				playerShotChart(snapshot, userid, game, player);
		  				statsTable(snapshot, userid, game, player, 0);
		  				setTimeout(function() {
		  					advTable();
		  				}, 0);
		  				team = 0;
		  			}
		  		}
		  		var playerlist = document.getElementById("playerbuttons");
		 		playerlist.appendChild(ele);
		 	});
		});
		if(playerid) {
			$("#headers").hide();
			setTimeout(function() {
				playerShotChart(snapshot, userid, game, player);
				statsTable(snapshot, userid, game, player, 0);
				setTimeout(function() {
			  		advTable();
				}, 0);
				team = 0;
			},1000);
		}else {
			$("#active").hide();
			setHeader(nam, sch, loc, sea);
			console.log("HERE");
			loadShots2(snapshot, userid);
			setTimeout (function() {
				playerInfo2(snapshot, userid);	
			}, 0);
			setTimeout (function() {
			//this is where to call advanced stats functions
				advancedStats();	
			}, 1000);
			setTimeout (function() {
				loadAverages2(snapshot, userid);
			}, 1000);
		}
	});
}

$(document).ready(main);