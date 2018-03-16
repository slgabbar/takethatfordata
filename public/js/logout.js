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
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    var uid = user.uid;
	  var ref = firebase.database().ref("/test");
  ref.once("value", function(snapshot) {
  console.log(snapshot.val());
  }, function (error) {
    console.log("Error: " + error.code);
	});
    // ...
  } else {
   console.log("signed out");
    // User is signed out.
    // ...
  }
});
function test() {
var x = document.getElementById("fname").value;
var y = document.getElementById("password").value;
firebase.auth().signInWithEmailAndPassword(x, y).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...

});

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    window.location = '../dashboard'; //After successful login, user will be redirected to home.html
  }
});
}