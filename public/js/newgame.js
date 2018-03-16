// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDmi6qgpfnoCZ8a2FM2APfX74dXfiJ9PFY",
    authDomain: "takethatfordata-8f719.firebaseapp.com",
    databaseURL: "https://takethatfordata-8f719.firebaseio.com",
    projectId: "takethatfordata-8f719",
    storageBucket: "takethatfordata-8f719.appspot.com",
    messagingSenderId: "211430446462"
  };
  firebase.initializeApp(config);


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
  
function SubmitNewGame() {
  var date = document.getElementById("date").value;
  var location = document.getElementById("location").value;
  var opponent = document.getElementById("opponent").value;
  var homevisitor = document.getElementById("homevisitor").value;

  if (!Date.parse(date)|| date=='') {
   document.getElementById("errormessage").style.display = "block";
    document.getElementById("errormessage1").style.display = "none";
     document.getElementById("errormessage2").style.display = "none";
    return;
  }
  if (location == null || location =='') {
    document.getElementById("errormessage").style.display = "none";
    document.getElementById("errormessage1").style.display = "block";
     document.getElementById("errormessage2").style.display = "none";
    return;
  }
  if (opponent == null || opponent =='') {
    document.getElementById("errormessage").style.display = "none";
    document.getElementById("errormessage1").style.display = "none";
    document.getElementById("errormessage2").style.display = "block";
    return;
  }

  var user = firebase.auth().currentUser;
	if (user) {
	  var db = firebase.database();
	  var ref = db.ref("/users/" + user.uid + "/teams");
	  ref.on("child_added", function (snapshot) {
	    //make new game in database and set as active
	    var ss = snapshot.val();
		var key = snapshot.key;
		var obj = { "opponent" : opponent, "date" : date, "location":location, "homevisitor":homevisitor};
		var game_key = date + "_" + opponent + "_" + location;
		game_key = encodeURIComponent(game_key);
		var reff = db.ref("/users/" + user.uid + "/teams/" + key + "/season_" + 
		  ss.active_season + "/games/" + game_key);
		  reff.set(obj);
		var reff = db.ref("/users/" + user.uid + "/teams/" + key);
		reff.update({"active_game": game_key});
		
		//set all statistics for all players to zero
		var playref = db.ref("/users/" + user.uid + "/teams/" + key + "/season_" + 
		  ss.active_season + "/players");
		playref.on("child_added",function(play_snap) {
		  var statref = db.ref("/statistics/");
		  var playerkey = play_snap.key;
		  statref.on("child_added",function(stat_snap) {
		    var stat = stat_snap.key;
			var gameref = db.ref("/users/" + user.uid + "/teams/" + key + "/season_" + 
		      ss.active_season + "/games/" + game_key + "/players/" + playerkey);
			  var obj = { [stat] : 0};
		    gameref.update(obj);
		  });
		});
	  });
	  
    document.getElementById("message").style.display = "block";
     document.getElementById("errormessage").style.display = "none";
    document.getElementById("errormessage1").style.display = "none";
    document.getElementById("errormessage2").style.display = "none";

	} else {
	  // No user is signed in.
	  console.log("Error not logged in");
	}
  }

// after you click new game, it redirects to the input / add page
//firebase.auth().onAuthStateChanged(user => {
 // if(user) {
//    window.location = '../input'; //After successful login, user will be redirected to home.html
//  }
//});


function nextbtn() {
  window.location = '../input'; //After succesful signup, user will be redirected to create_team
}