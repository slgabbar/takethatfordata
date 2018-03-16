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

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
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
		  fillData();
		};
		var playerlist = document.getElementById("playerbuttons");
		playerlist.appendChild(ele);
	  });
	});
	
	//Fill Team, Season, Game info
	ref.on("child_added", function (snapshot) {
		var ss = snapshot.val();
		document.getElementById("teamname").innerHTML = ss.name;
		document.getElementById("active_season").innerHTML = "Season " + ss.active_season;
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
	  element.style.fontSize = "15px";
	  element.style.height = "auto";
	  
	  var plus = document.createElement("input");
	  plus.type = "button";
	  plus.value = "+";
	  plus.id = snapshot.key;
	  plus.style.fontSize = "12px";
	  plus.style.backgroundColor = "#437af8";
	  plus.style.color = "#fff";
	  plus.style.overflow = "hidden";
	  plus.style.right="0";
	  plus.style.cssFloat="right";
	  plus.style.padding = "10px 15px";
	  plus.onclick = function() {
	    plusminus(this.id, true);
	  };
	  
	  var minus = document.createElement("input");
	  minus.type = "button";
	  minus.value = "-";
	  minus.style.fontSize = "12px"
	  minus.style.backgroundColor = "#437af8";
	  minus.style.color="#fff";
	  minus.style.cssFloat="right";
	  minus.style.overflow = "hidden";
	  minus.style.padding = "10px 15px";
	  minus.id = snapshot.key;
	  minus.onclick = function() {
	    plusminus(this.id, false);
	  };
	  var linebreak = document.createElement("p");
	  linebreak.innerHTML = "<br>";

	  element.appendChild(plus);
	  element.appendChild(minus);
	  element.appendChild(linebreak);
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
