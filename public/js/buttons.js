 var data = []

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
	var tr2 = document.createElement("tr");
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
		snapshot_shot.forEach(function(child) {
			var key = child.key;
			var data = child.val();
			printShotStats(data.x, data.y, 
				data.shot_attempted_flag, data.shot_attempted);
		});
	});

}


function printShotStats(x, y, make, dist) {
	console.log("New Shot");
	console.log("x coord: " + x);
	console.log("y coord: " + y);
	console.log("attempted: " + dist);
	if (make == 1) {
		console.log("shot made");
	} else {
		console.log("shot missed");
	}
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
	
	//Creates stat labels with plus minus buttons
	
	var ref = db.ref("/statistics");
	ref.on("child_added", function (snapshot) {
	  var element = document.createElement("div");
	  element.innerHTML = snapshot.key;
      element.name = snapshot.key;
	  element.id = snapshot.key;
	  
	  var plus = document.createElement("input");
	  plus.type = "button";
	  plus.value = "+";
	  plus.id = snapshot.key;
	  plus.onclick = function() {
	    plusminus(this.id, true);
	  };
	  
	  var minus = document.createElement("input");
	  minus.type = "button";
	  minus.value = "-";
	  minus.id = snapshot.key;
	  minus.onclick = function() {
	    plusminus(this.id, false);
	  };
	  
	  element.appendChild(plus);
	  element.appendChild(minus);
	  var form = document.getElementById("statbuttons");
	  form.appendChild(element);
	});
	
  } else {
    console.log("Error not logged in");
  }
});

function plusminus(stat,operation) {
	    var user = firebase.auth().currentUser;
		if (user) {
		  var ref = db.ref("/users/" + user.uid + "/teams");
	      ref.on("child_added", function (snapshot) {
	        var ss = snapshot.val();
		    var teamkey = snapshot.key;
		    var gamekey = ss.active_game;
			var playerkey = document.getElementById("playerkey").innerHTML;
		    var season = ss.active_season;
			var readstatref = db.ref("/users/" + user.uid + "/teams/" + teamkey + "/season_" +
	          season + "/games/" + gamekey + "/players/" + playerkey + "/" + stat);
			var val = 0;
			readstatref.on("value", function(snap) {
			  val = snap.val();
			}, function(error) {});
			if (operation) {
			  val++;
			} else {
			  val--;
			}
	        var ref = db.ref("/users/" + user.uid + "/teams/" + teamkey + "/season_" +
	          season + "/games/" + gamekey + "/players/" + playerkey);
	        var obj = { [stat] : val };
	        ref.update(obj);
			var playername = document.getElementById("playername").innerHTML;
			var string = "";
			if (operation) {
				string = playername + " " + stat + " + 1";
			} else {
				string = playername + " " + stat + " - 1";
			}
			document.getElementById("lastaction").innerHTML = string;
	      });
		} else {
		  console.log("Error not logged in");
		}
}
