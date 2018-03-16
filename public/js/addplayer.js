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
  var db = firebase.database();
  updatelist();

  
function test() {
	var x = document.getElementById("pfname").value;
	var y = document.getElementById("plname").value;
	var z = document.getElementById("pnumber").value;
  var form = document.getElementById("playerform").value;
	var user = firebase.auth().currentUser;

  if ( x.length < 1) {
  alert('Error: Please enter name');
  return;
}
  if (y.length < 1) {
    alert('Error: Please enter last name');
    return;
  }

  if (z.length < 1) {
    alert('Error: Please enter Player Number');
    return;
  }
	if (user) {
	  
	  var ref = db.ref("/users/" + user.uid + "/teams/");
	  ref.on("child_added", function(snapshot) {
	    var ss = snapshot.val();
		  var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + ss.active_season + "/players");
      var obj = { "firstname":x, "lastname":y, "number":z};
	    reff.push(obj);	  
      clearFields()

	  });
	} else {
	  // No user is signed in.
	  console.log("Error not logged in");
	}
	//updatelist();
// When User click "Next", sign up page is finished / complete then move onto the dashboard
//firebase.auth().onAuthStateChanged(user => {
 // if(user) {
//    window.location = '../dashboard'; //After successful login, user will be redirected to home.html
//  }
//});
}


function del(playerkey) {
	var user = firebase.auth().currentUser;
	if (user) {
	  var ref = db.ref("/users/" + user.uid + "/teams/");
	  ref.on("child_added", function(snapshot) {
	    var ss = snapshot.val();
		var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" + ss.active_season + "/players/" + playerkey );
		reff.remove();
	  });
	} else {
	  // No user is signed in.
	  console.log("Error not logged in");
	}
	updatelist();
}

function clearFields(){
  document.getElementById("pfname").value = "";
  document.getElementById("plname").value = "";
  document.getElementById("pnumber").value = "";
}

function updatelist() {
var playerlist = document.getElementById("players");
while (playerlist.childNodes.length > 0) {
	playerlist.removeChild(playerlist.lastChild);
}
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //This code lists the players in the current team's active season
    var ref = db.ref("/users/" + user.uid + "/teams");
	ref.on("child_added", function (snapshot) {
	  var ss = snapshot.val();
	  var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key + "/season_" +
	    ss.active_season + "/players/");
	  reff.on("child_added", function (snapshot_player) {
	    snap = snapshot_player.val();
		var row = document.createElement("tr");
		var firstname = document.createElement("td");
		var lastname = document.createElement("td");
		var number = document.createElement("td");
		firstname.innerHTML = snap.firstname;
		lastname.innerHTML = snap.lastname;
		number.innerHTML = snap.number;
		row.appendChild(firstname);
		row.appendChild(lastname);
		row.appendChild(number);
		var col = document.createElement("td");
		var delbutton = document.createElement("input");
	  delbutton.type = "button";
	  delbutton.value = "Delete";
	  delbutton.id = snapshot_player.key;
	  delbutton.onclick = function() {
	    del(this.id);
	  };
	  col.appendChild(delbutton);
	  row.appendChild(col);
		var playerlist = document.getElementById("players");
		playerlist.appendChild(row);
		
		
	  });
	});
  } else {
  	  console.log("Error not logged in");
  }
});
} 

function nextbtn() {
  window.location = '../dashboard'; //After succesful signup, user will be redirected to create_team
}
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
   //user is sign in
    // ...
    document.getElementById("newuser").style.display = "none";
    document.getElementById("newuser1").style.display = "none";
  } else {
   console.log("signed out");
    // User is signed out.
    document.getElementById("alreadylog").style.display = "none";
    document.getElementById("alreadylog2").style.display = "none";
    document.getElementById("alreadylog3").style.display = "none";
  }
});
 
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


