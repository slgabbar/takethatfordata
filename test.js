src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"

// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = ***REMOVED***
    apiKey: "AIzaSyDmi6qgpfnoCZ8a2FM2APfX74dXfiJ9PFY",
    authDomain: "takethatfordata-8f719.firebaseapp.com",
    databaseURL: "https://takethatfordata-8f719.firebaseio.com",
    projectId: "takethatfordata-8f719",
    storageBucket: "takethatfordata-8f719.appspot.com",
    messagingSenderId: "211430446462"
  ***REMOVED***;
  firebase.initializeApp(config);
  const db = firebase.database(),
      auth = firebase.auth();

var x = document.getElementById("fname").value;
var y = document.getElementById("lname").value;

console.log(x);
console.log(y);
