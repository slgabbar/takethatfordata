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
  var user = firebase.auth().currentUser;
  var name, email;

function saveteaminfo(){
   document.getElementById("message1").style.display = "block";
}


function saveinfo(){
  //document.getElementById("message").style.display = "block";
  var email = document.getElementById("email").value;
  var newemail = document.getElementById("newemail").value;
  var teamname = document.getElementById("teamname").value;
  var newpassword = document.getElementById("newpassword").value;
  var newpassword1 = document.getElementById("newpassword1").value;
  var form = document.getElementById("userinfo").value;
  var currentpassword = document.getElementById("currentpassword").value;
  var user = firebase.auth().currentUser;

  // errors messages - check before save
  if (newemail == "") {
    return;
  }

  if (newpassword == ""){
    return;
  }
  if (newpassword.length < 5 && !newpassword=="") {
    document.getElementById("errormessage").style.display = "block";
    document.getElementById("message").style.display = "none";
    return;
   }
  if (!newpassword.match(newpassword1)) {
   
      document.getElementById("errormessage").style.display = "block";
      document.getElementById("message").style.display = "none";
    return;
   }

   // push to update new email address
   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      NewEmail = newemail;
      // User is logged in. you can access firebase.auth().currentUser.
      // You can now perform operations on the user.
      user.updateEmail(NewEmail).then(function() {
        // Update successful.
        console.log(NewEmail);
      }).catch(function(error) {
        // An error happened.
        console.log(NewEmail);
      });
    } else {
      // No user logged in.
    }
  });

}


function addnewplayer() {
  var x = document.getElementById("firstname").value;
  var y = document.getElementById("lastname").value;
  var z = document.getElementById("number").value;
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



function setHeader(name, school, loc) {
  document.getElementById("teamname").value = name;
  document.getElementById("school").value = school;
  document.getElementById("location").value = loc;
}

function setInfo(email){
  document.getElementById("email").value = email;
}
firebase.auth().onAuthStateChanged(function(user) {
  var user = firebase.auth().currentUser;
  var email;
  email = user.email;
  setInfo(email);

  var ref = db.ref("/users/" + user.uid + "/teams");
  ref.on("child_added", function (snapshot) {
    var ss = snapshot.val();
    var name = ss.name;
    var school = ss.school;
    var location = ss.location;
    setHeader(name,school, location);
   
  });
});


// -- signout--
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

 // if the user is not sign it, they cannot access this page
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
    window.location = '../'; 
  }
});