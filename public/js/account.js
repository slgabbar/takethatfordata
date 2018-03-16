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
   var teamname = document.getElementById("teamname").value;
   var school = document.getElementById("school").value;
   var location = document.getElementById("location").value;
   var user = firebase.auth().currentUser;
   if (teamname.length < 1) {

    document.getElementById("errormessage").style.display = "block";
    document.getElementById("errormessage1").style.display = "none";
    return;
  }

  if (location.length < 1) {
     document.getElementById("errormessage1").style.display = "block";
     document.getElementById("errormessage").style.display = "none";
  }

  if (user) {
    var db = firebase.database();
    var ref = db.ref("/users/" + user.uid + "/teams/");

    ref.on("child_added", function(snapshot) {
      var ss = snapshot.val();
      var reff = db.ref("/users/" + user.uid + "/teams/" + snapshot.key);
      var obj = { "name":teamname, "location":location, "school":school};
      if (reff===null) {
        reff.update(obj);
      } else {
        reff.update(obj);
        document.getElementById("message").style.display = "block";
      }
    });
  } else {
    // No user is signed in.
    console.log("Error not logged in");
    }
  
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

  console.log("New Email: " + newemail);
  
  // errors messages - check before save
  if (newemail == "") {
  }
  if (newpassword == ""){
  }
  if (currentpassword == ""){
    document.getElementById("errormessageold").style.display = "block";
    document.getElementById("errormessagenot").style.display = "none";
  }
  if (newpassword.length < 5 && !newpassword=="") {
    document.getElementById("errormessage").style.display = "block";
    document.getElementById("message").style.display = "none";
    
   }
  if (!newpassword.match(newpassword1)) {
      document.getElementById("errormessage").style.display = "block";
      document.getElementById("message").style.display = "none";
   }

  var credential = firebase.auth.EmailAuthProvider.credential(
    email,currentpassword);
    console.log("Email: " + email);
  user.reauthenticateWithCredential(credential).then(function() {
    // check if the password is correct
          // User re-authenticated.
          // update email.. it's not working
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              var newemail2 = document.getElementById("newemail").value;
              console.log("email:" + newemail2);
              user.updateEmail(newemail2);
              document.getElementById("message").style.display = "block";
            } else {
              // No user is signed in.
            }
          });
        // updating password goes here.. maybe for now i can just redirect to reset password. idk
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              var newpassword12 = document.getElementById("newpassword").value;
              var newpassword13 = document.getElementById("newpassword").value;
              console.log("new password:" + newpassword12);

              if (newpassword12.length < 5 && !newpassword12=="") {
                document.getElementById("errormessage").style.display = "block";
                document.getElementById("message").style.display = "none";
                
               }
              if (!newpassword12.match(newpassword13)) {
                  document.getElementById("errormessage").style.display = "block";
                  document.getElementById("message").style.display = "none";
               }

              user.updatePassword(newpassword12);
              document.getElementById("message").style.display = "block";
              document.getElementById("errormessagenot").style.display = "none";
            } else {
              // No user is signed in.
            }
          });


 }).catch(function(error) {
  // An error happened.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
        document.getElementById("errormessagenot").style.display = "block";
      } else {
        alert(errorMessage);
      }
  alert(errorMessage);
  });


} //end of save info


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