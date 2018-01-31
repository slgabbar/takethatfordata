
var firebase = require("firebase");
var firebaseui = require("firebaseui");
// Initialize firebase
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
	 
