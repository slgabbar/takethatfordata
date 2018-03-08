//dashboard
var data = []
var count = 0


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



function loadData(snapshot) {
	count = 0;
	var user = firebase.auth().currentUser;
	var snap = snapshot.val();
	var ref = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + 
		snap.active_season +"/games/");
	ref.once("value").then(function(snapshot_game) {
		snapshot_game.forEach(function(game) {
			var team_query = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + 
			"/season_" + snap.active_season + "/games/" + game.key + "/players/");
			team_query.once("value").then(function(snapshot_player) {
				snapshot_player.forEach(function(player) {
					var player_query = db.ref("/users/" + user.uid + "/teams/" + 
						snapshot.key + "/season_" + snap.active_season + "/games/" + 
						game.key + "/players/" + player.key + "/shots/")
					player_query.once("value").then(function(snapshot_shot) {
						snapshot_shot.forEach(function(shot) {
							var shot_data = shot.val();
							console.log(count + ":" + shot_data.x);
							data[count] = {
        						"shot_attempted_flag": shot_data.shot_attempted_flag,
        						"shot_attempted": shot_data.shot_attempted,
        						"shot_made_flag": shot_data.shot_made_flag,
        						"x":shot_data.x,
        						"y":shot_data.y,
								"count": shot_data.count
							}
							console.log(data[count].x);
							count++;
						});
						set_chart(data);
					});
				});
			});
		});
	});
}




function setHeader(name, school, loc, season) {
	document.getElementById("team_name").innerHTML = name;
	document.getElementById("school").innerHTML = school;
	document.getElementById("location").innerHTML = loc;
	document.getElementById("active_season").innerHTML = "Active Season: "+ season;
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
		loadData(snapshot);
	});
	set_chart(data);
});

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

